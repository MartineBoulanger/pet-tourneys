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
): Array<{ name: string; count: number }> {
  const petCounts = new Map<string, number>();

  battles.forEach((battle) => {
    battle.player_team?.forEach((pet) => {
      const count = petCounts.get(pet) || 0;
      petCounts.set(pet, count + 1);
    });
  });

  return Array.from(petCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}
