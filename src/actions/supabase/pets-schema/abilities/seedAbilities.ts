// ==================================================
// Get de data from Blizzard Api +
// scraping from Warcraftpets.com to more info
// for each pet ability.
// These functions joins the data,
// and then seeds the database with the data
// ==================================================
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import { blizzardFetch } from '@/lib/blizzard/client';
import { buildWarcraftPetsUrl } from '@/utils/blizzard/buildWarcraftPetsUrl';
import { parseAbilityPage } from '@/utils/blizzard/parseAbilityPage';
import { PetType, SCHEMA } from '@/types/supabase.types';
import { createClient } from '@supabase/supabase-js';
import {
  AbilityDetails,
  BlizzardPetAbilityMedia,
} from '@/types/supabase.types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { db: { schema: SCHEMA.PETS } },
);

const CONCURRENCY = 5;
const DELAY_MS = 300;

async function getAbilityMedia(abilityID: number) {
  const media = await blizzardFetch<{
    assets: BlizzardPetAbilityMedia[];
  }>(`/data/wow/media/pet-ability/${abilityID}`, {
    region: 'eu',
    namespace: 'static-eu',
    locale: 'en_GB',
  });

  return {
    assets: media?.assets?.map((asset: BlizzardPetAbilityMedia) => ({
      key: asset.key,
      value: asset.value,
      file_data_id: asset.file_data_id,
    })),
  };
}

async function getAbilityDetails(
  abilityName: string,
  petType: PetType,
): Promise<AbilityDetails> {
  const fallback: AbilityDetails = {
    description: null,
    effect: null,
    hitChance: 100,
  };

  try {
    const url = await buildWarcraftPetsUrl(abilityName, petType);

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; pet-app/1.0)',
        Accept: 'text/html',
      },
      next: { revalidate: 86400 }, // 24 hours
    });

    if (!res.ok) return fallback;

    const html = await res.text();

    console.log('Fetched ability details from WarcraftPets:', {
      url,
      html: html.slice(0, 200),
    });

    return parseAbilityPage(html);
  } catch {
    return fallback;
  }
}

async function seedAbilities() {
  // 1. Fetch all ability IDs from Blizzard
  const index = await blizzardFetch<{
    abilities: Array<{ id: number; name: string }>;
  }>('/data/wow/pet-ability/index', {
    region: 'eu',
    namespace: 'static-eu',
  });

  const abilities = index.abilities;
  console.log(`Seeding ${abilities.length} abilities...`);

  let success = 0;
  let failed = 0;

  // 2. Process in batches
  for (let i = 0; i < abilities.length; i += CONCURRENCY) {
    const batch = abilities.slice(i, i + CONCURRENCY);

    await Promise.all(
      batch.map(async ({ id, name }) => {
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

          const petType = (base.battle_pet_type?.type ?? null) as PetType;
          const petTypeName = (base.battle_pet_type?.name ?? null) as PetType;

          if (!petTypeName) {
            console.warn(`⚠ Skipping ${id} ${name} — no type`);
            return;
          }

          const [details, icon] = await Promise.all([
            getAbilityDetails(base.name, petType),
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
        }
      }),
    );

    await new Promise((r) => setTimeout(r, DELAY_MS));
  }
  console.log(`\nDone. ${success} succeeded, ${failed} failed.`);
}

seedAbilities().catch(console.error);
