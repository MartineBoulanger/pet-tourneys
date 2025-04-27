import { BattleLog } from '@/types';

// Helper functions for analysis
export function calculateAverageDuration(battles: BattleLog[]): string {
  if (battles.length === 0) return 'N/A';

  const totalSeconds = battles.reduce((sum, battle) => {
    if (!battle.duration) return sum;

    const minutesMatch = battle.duration.match(/(\d+)\s*m/);
    const secondsMatch = battle.duration.match(/(\d+)\s*s/);

    const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
    const seconds = secondsMatch ? parseInt(secondsMatch[1]) : 0;

    return sum + minutes * 60 + seconds;
  }, 0);

  const averageSeconds = totalSeconds / battles.length;
  const mins = Math.floor(averageSeconds / 60);
  const secs = Math.round(averageSeconds % 60);

  return `${mins}m ${secs}s`;
}

// Helper functions for getting to most used pets
export function getMostUsedPets(
  battles: BattleLog[],
  limit = 8
): Array<{
  name: string;
  count: number;
  playerCount: number;
  opponentCount: number;
  team: 'player' | 'opponent' | 'both';
}> {
  const playerPetCounts = new Map<string, number>();
  const opponentPetCounts = new Map<string, number>();

  battles.forEach((battle) => {
    // Count player pets
    battle.player_team?.forEach((pet) => {
      playerPetCounts.set(pet, (playerPetCounts.get(pet) || 0) + 1);
    });

    // Count opponent pets
    battle.opponent_team?.forEach((pet) => {
      opponentPetCounts.set(pet, (opponentPetCounts.get(pet) || 0) + 1);
    });
  });

  // Combine results with team information
  const allPets = new Set([
    ...Array.from(playerPetCounts.keys()),
    ...Array.from(opponentPetCounts.keys()),
  ]);

  const combined = Array.from(allPets).map((pet) => {
    const playerCount = playerPetCounts.get(pet) || 0;
    const opponentCount = opponentPetCounts.get(pet) || 0;
    const total = playerCount + opponentCount;

    let team: 'player' | 'opponent' | 'both' = 'both';
    if (playerCount > 0 && opponentCount === 0) team = 'player';
    if (opponentCount > 0 && playerCount === 0) team = 'opponent';

    return {
      name: pet,
      count: total,
      playerCount,
      opponentCount,
      team,
    };
  });

  return combined
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map(({ name, count, playerCount, opponentCount, team }) => ({
      name,
      count,
      playerCount,
      opponentCount,
      team,
    }));
}
