import type {
  LevellingQueue,
  PmqQueueExport,
  PmqQueuePet,
} from '@/types/rematch-import.types';

export function buildPmqQueueExport(
  queue: LevellingQueue,
  petTypes: Record<number, number>,
): PmqQueueExport {
  const pets: PmqQueuePet[] = [];
  const missingTypes = new Set<number>();

  for (const queuePet of queue.pets) {
    if (!queuePet.parts) {
      continue;
    }

    const { species, breed, level, rarity } = queuePet.parts;

    const type = petTypes[species];

    if (type === undefined) {
      missingTypes.add(species);
      continue;
    }

    pets.push({
      species,
      breed,
      level,
      rarity,
      type,
    });
  }

  const lines = pets.map(({ species, breed, level, rarity, type }) =>
    [
      `species=${species}`,
      `breed=${breed}`,
      `level=${level}`,
      `rarity=${rarity}`,
      `type=${type}`,
    ].join(';'),
  );

  return {
    pets,
    missingTypes: [...missingTypes],
    string: ['PMQ1', ...lines].join('\n'),
  };
}
