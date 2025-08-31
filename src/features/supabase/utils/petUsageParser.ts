import { PetUsageData } from '../types';

export function parsePetUsage(rawUsage: string) {
  if (!rawUsage) return [];

  const petMap = new Map<string, PetUsageData>();

  rawUsage
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && line.includes('Played:'))
    .forEach((line) => {
      const name = line.match(/^([^(]+)/)?.[1].trim() || 'Unknown';
      const parenContent = line.match(/\(([^)]+)\)/)?.[1] || '';
      const [type, stats, breeds] = parenContent
        .split(',')
        .map((s) => s.trim());
      const played = parseInt(line.match(/Played:\s*(\d+)/)?.[1] || '1');

      if (name !== 'Unknown') {
        if (!petMap.has(name)) {
          petMap.set(name, {
            name,
            type: type || 'Unknown',
            stats: [],
            breeds: [],
            times_played: [],
          });
        }
        const pet = petMap.get(name)!;

        const breedIndex = pet.breeds.findIndex((b) => b === breeds);

        if (breedIndex !== -1) {
          pet.times_played[breedIndex] += played;
        } else {
          pet.stats.push(stats || '');
          pet.breeds.push(breeds || '');
          pet.times_played.push(played);
        }
      }
    });

  return Array.from(petMap.values()).map((pet) => ({
    pet_data: {
      name: pet.name,
      type: pet.type,
      stats: pet.stats,
      breeds: pet.breeds,
      times_played: pet.times_played,
    },
    total_played: pet.times_played.reduce((sum, count) => sum + count, 0),
  }));
}
