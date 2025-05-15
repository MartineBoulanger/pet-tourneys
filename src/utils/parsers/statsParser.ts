import { BreedStats, StatDistribution, TournamentPetStat } from '../types';

export function parseAndAggregateStats(
  pets: TournamentPetStat[]
): StatDistribution {
  const stats: StatDistribution = {
    health: {},
    power: {},
    speed: {},
  };

  pets.forEach((pet) => {
    pet.breed_stats.forEach((breed: BreedStats) => {
      if (!breed.stats) return;

      // Split stats string like "H1404/P342/S236"
      const statParts = breed.stats.split('/');

      statParts.forEach((part: string) => {
        const type = part[0];
        const value = parseInt(part.substring(1));

        if (isNaN(value)) return;

        switch (type) {
          case 'H':
            stats.health[value] =
              (stats.health[value] || 0) + (breed.times_played || 1);
            break;
          case 'P':
            stats.power[value] =
              (stats.power[value] || 0) + (breed.times_played || 1);
            break;
          case 'S':
            stats.speed[value] =
              (stats.speed[value] || 0) + (breed.times_played || 1);
            break;
        }
      });
    });
  });

  return stats;
}

export function convertToGraphData(stats: Record<number, number>) {
  return Object.entries(stats)
    .map(([value, count]) => ({
      value: parseInt(value),
      count,
    }))
    .sort((a, b) => a.value - b.value);
}
