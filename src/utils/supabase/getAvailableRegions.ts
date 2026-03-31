import { Match } from '@/types/supabase.types';

// =================================================
// Helper function for the matches actions
// - get available region for the player rankings
// =================================================
export function getAvailableRegions(matches: Match[]): string[] {
  const regions = new Set<string>();
  matches.forEach((match) => {
    if (match.region) regions.add(match.region);
  });
  return Array.from(regions).sort();
}
