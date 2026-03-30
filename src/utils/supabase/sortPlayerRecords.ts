import { EnhancedPlayerRecord } from '@/types/supabase.types';

export function sortPlayerRecords(
  records: EnhancedPlayerRecord[],
): EnhancedPlayerRecord[] {
  const sorted = [...records];

  return sorted.sort((a, b) => {
    // Move forfeit-only players to the bottom
    if (a.forfeitOnly && !b.forfeitOnly) return 1;
    if (!a.forfeitOnly && b.forfeitOnly) return -1;
    // Normal sorting by wins/losses
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (a.losses !== b.losses) return a.losses - b.losses;
    return a.playerName.localeCompare(b.playerName);
  });
}
