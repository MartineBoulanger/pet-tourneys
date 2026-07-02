import { AbilityDetails } from '@/types/supabase.types';

function stripHtmlAndSca(raw: string): string {
  return raw
    .replace(/<!--sca-->/g, '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractField(html: string, id: number, field: string): string | null {
  const match = html.match(
    new RegExp(`g_petabilities\\[${id}\\]\\.${field} = "([\\s\\S]*?)";`),
  );
  return match ? match[1] : null;
}

export function parseWowheadTooltip(html: string, id: number): AbilityDetails {
  const tooltipRaw = extractField(html, id, 'tooltip_enus');
  const buffRaw = extractField(html, id, 'buff_enus');

  let description: string | null = null;
  let hitChance: number | null = null;

  if (tooltipRaw) {
    const text = stripHtmlAndSca(tooltipRaw);
    const hitMatch = text.match(/(\d+)%\s*Hit Chance/i);
    if (hitMatch) {
      hitChance = parseInt(hitMatch[1], 10);
      description = text.replace(/\d+%\s*Hit Chance/i, '').trim() || null;
    } else {
      description = text || null;
    }
  }

  const effect = buffRaw ? stripHtmlAndSca(buffRaw) || null : null;

  return { description, effect, hitChance };
}
