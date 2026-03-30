import { BattleLog } from '@/types/supabase.types';

// =================================================
// Helper function for the battle logs actions
// - getting the most used pets in a list
// =================================================
export function getMostUsedPets(
  battles: BattleLog[],
  limit = 8,
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
