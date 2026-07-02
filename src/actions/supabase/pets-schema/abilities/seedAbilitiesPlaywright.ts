import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Page } from 'playwright';
import { blizzardFetch } from '@/lib/blizzard/client';
import { parseWowheadTooltip } from '@/utils/blizzard/parseWowheadTooltip';
import { PetType, SCHEMA } from '@/types/supabase.types';
import { createClient } from '@supabase/supabase-js';
import {
  AbilityDetails,
  BlizzardPetAbilityMedia,
} from '@/types/supabase.types';

chromium.use(StealthPlugin());

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { db: { schema: SCHEMA.PETS } },
);

const CONCURRENCY = 3;
const DELAY_MS = 500;

async function getAbilityMedia(abilityID: number) {
  const media = await blizzardFetch<{ assets: BlizzardPetAbilityMedia[] }>(
    `/data/wow/media/pet-ability/${abilityID}`,
    { region: 'eu', namespace: 'static-eu', locale: 'en_GB' },
  );
  return {
    assets: media?.assets?.map((asset: BlizzardPetAbilityMedia) => ({
      key: asset.key,
      value: asset.value,
      file_data_id: asset.file_data_id,
    })),
  };
}

async function getAbilityDetails(
  id: number,
  page: Page,
): Promise<AbilityDetails> {
  const fallback: AbilityDetails = {
    description: null,
    effect: null,
    hitChance: null,
  };
  try {
    await page.goto(`https://www.wowhead.com/pet-ability=${id}&xml`, {
      waitUntil: 'domcontentloaded',
      timeout: 15000,
    });
    const html = await page.content();
    return parseWowheadTooltip(html, id);
  } catch {
    return fallback;
  }
}

async function seedAbilities() {
  const index = await blizzardFetch<{
    abilities: Array<{ id: number; name: string }>;
  }>('/data/wow/pet-ability/index', { region: 'eu', namespace: 'static-eu' });

  const { data: existing } = await supabase
    .from('abilities')
    .select('id')
    .not('description', 'is', null);

  const existingIds = new Set(
    (existing ?? []).map((r: { id: number }) => r.id),
  );
  const abilities = index.abilities.filter(({ id }) => !existingIds.has(id));
  console.log(
    `Skipping ${existingIds.size} abilities with existing descriptions.`,
  );
  console.log(`Seeding ${abilities.length} abilities...`);

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  });

  let success = 0;
  let failed = 0;

  for (let i = 0; i < abilities.length; i += CONCURRENCY) {
    const batch = abilities.slice(i, i + CONCURRENCY);

    await Promise.all(
      batch.map(async ({ id, name }) => {
        const page = await context.newPage();
        try {
          const base = await blizzardFetch<{
            id: number;
            name: string;
            battle_pet_type?: { type: string; name: string };
            cooldown?: number;
            rounds?: number;
          }>(`/data/wow/pet-ability/${id}`, {
            region: 'eu',
            namespace: 'static-eu',
          });

          const petTypeName = (base.battle_pet_type?.name ?? null) as PetType;

          if (!petTypeName) {
            console.warn(`⚠ Skipping ${id} ${name} — no type`);
            return;
          }

          const [details, icon] = await Promise.all([
            getAbilityDetails(base.id, page),
            getAbilityMedia(id),
          ]);

          const { error } = await supabase.from('abilities').upsert({
            id: base.id,
            name: base.name,
            type: petTypeName,
            cooldown: base.cooldown ?? null,
            rounds: base.rounds ?? null,
            description: details.description,
            hit_chance: details.hitChance,
            effect: details.effect,
            icon: icon?.assets?.[0]?.value ?? null,
            seeded_at: new Date().toISOString(),
          });

          if (error) throw error;

          success++;
          console.log(
            `✓ [${i + 1}–${Math.min(i + CONCURRENCY, abilities.length)}/${abilities.length}] ${name}`,
          );
        } catch (error) {
          failed++;
          console.error(`✗ ${id} ${name}:`, error);
        } finally {
          await page.close();
        }
      }),
    );

    await new Promise((r) => setTimeout(r, DELAY_MS));
  }

  await browser.close();
  console.log(`\nDone. ${success} succeeded, ${failed} failed.`);
}

seedAbilities().catch(console.error);
