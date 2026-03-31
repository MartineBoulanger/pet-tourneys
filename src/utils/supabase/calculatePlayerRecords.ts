import { Match, PlayerRecord } from '@/types/supabase.types';

// =================================================
// Helper function for the matches actions
// - calculate the rankings from the players
// =================================================
export async function calculatePlayerRecords(
  matches: Match[],
): Promise<PlayerRecord[]> {
  const playerStats: Record<
    string,
    { wins: number; losses: number; region: string }
  > = {};

  // Process each match
  matches.forEach((match) => {
    // Determine the winner and loser
    const winner =
      match.owner_score &&
      match.opponent_score &&
      match.owner_score > match.opponent_score
        ? match.owner
        : match.owner_score &&
            match.opponent_score &&
            match.owner_score < match.opponent_score
          ? match.owner === match.player1
            ? match.player2
            : match.player1
          : null; // tie

    // Skip ties
    if (winner === null) return;

    const loser = winner === match.player1 ? match.player2 : match.player1;
    const region = match.region || 'N/A';

    // Initialize players if not already tracked
    if (!playerStats[winner])
      playerStats[winner] = { wins: 0, losses: 0, region };
    if (!playerStats[loser])
      playerStats[loser] = { wins: 0, losses: 0, region };

    // Update stats
    playerStats[winner].wins += 1;
    playerStats[loser].losses += 1;
  });

  // Convert to array format and calculate win rates
  const records: PlayerRecord[] = Object.entries(playerStats).map(
    ([playerName, stats]) => {
      const totalGames = stats.wins + stats.losses;
      const winRate = totalGames > 0 ? (stats.wins / totalGames) * 100 : 0;

      return {
        playerName,
        wins: stats.wins,
        losses: stats.losses,
        region: stats.region,
        winRate: parseFloat(winRate.toFixed(2)),
      };
    },
  );

  // Sort by most wins first
  return records.sort((a, b) => b.wins - a.wins);
}
