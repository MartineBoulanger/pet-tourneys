import { AbilityDetails } from '@/types/supabase.types';
import { stripHtml } from './stripHtml';

export function parseAbilityPage(html: string): AbilityDetails {
  // ── Description paragraphs ───────────────────────────────────────────────
  // The ability description lives inside <div class="accenttext"> as <p> tags.
  // First non-empty <p> = main description; second (if exists) = effect text.
  const accentMatch = html.match(/<div class="accenttext">([\s\S]*?)<\/div>/i);
  let description: string | null = null;
  let effect: string | null = null;
  let hitChance: number | null = null;

  if (accentMatch) {
    const paragraphs = [
      ...accentMatch[1].matchAll(/<p(?:[^>]*)>([\s\S]*?)<\/p>/gi),
    ]
      .map((m) => stripHtml(m[1]).trim())
      .filter((t) => t.length > 0 && t !== '&nbsp;');

    // Extract hit chance from whichever paragraph contains it
    const hitParagraph = paragraphs.find((t) => /hit chance/i.test(t));
    if (hitParagraph) {
      const match = hitParagraph.match(/(\d+)%/);
      if (match) hitChance = parseInt(match[1], 10);
    }

    // Description and effect are everything except the hit chance paragraph
    const rest = paragraphs.filter((t) => !/hit chance/i.test(t));
    description = rest[0] ?? null;
    effect = rest[1] ?? null;
  }

  return { description, effect, hitChance };
}
