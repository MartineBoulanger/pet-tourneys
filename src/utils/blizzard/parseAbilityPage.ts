import { AbilityDetails } from '@/types/supabase.types';
import { stripHtml } from './stripHtml';

export function parseAbilityPage(html: string): AbilityDetails {
  // ── Hit chance ───────────────────────────────────────────────────────────
  // Appears as: <span style="color:#20ff20;">100</span>&nbsp;
  //             <span style="color:#ffffff;">Hit Chance</span>
  const hitMatch = html.match(
    /color:#20ff20[^>]*>(\d+)<\/span>&nbsp;\s*<span[^>]*>Hit Chance/i,
  );
  const hitChance = hitMatch ? parseInt(hitMatch[1], 10) : 100;

  // ── Description paragraphs ───────────────────────────────────────────────
  // The ability description lives inside <div class="accenttext"> as <p> tags.
  // First non-empty <p> = main description; second (if exists) = effect text.
  const accentMatch = html.match(/<div class="accenttext">([\s\S]*?)<\/div>/i);
  let description: string | null = null;
  let effect: string | null = null;

  if (accentMatch) {
    const paragraphs = [
      ...accentMatch[1].matchAll(/<p(?:[^>]*)>([\s\S]*?)<\/p>/gi),
    ]
      .map((m) => stripHtml(m[1]).trim())
      .filter((t) => t.length > 0 && t !== '&nbsp;');

    description = paragraphs[1] ?? null;
    effect = paragraphs[2] ?? null;
  }

  return { description, effect, hitChance };
}
