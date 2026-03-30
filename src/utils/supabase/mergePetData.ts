import { LeaguePetData } from '@/types/supabase.types';

// =================================================
// Helper function for the API actions
// - merging pet breed played count
// =================================================
function mergeBreedPlayCounts(
  existingBreeds: string[],
  existingCounts: number[],
  newBreeds: string[],
  newCounts: number[],
) {
  const mergedBreeds = [...new Set([...existingBreeds, ...newBreeds])];
  const mergedCounts = new Array(mergedBreeds.length).fill(0);

  // Add existing counts
  existingBreeds.forEach((breed, index) => {
    const mergedIndex = mergedBreeds.indexOf(breed);
    mergedCounts[mergedIndex] += existingCounts[index];
  });

  // Add new counts
  newBreeds.forEach((breed, index) => {
    const mergedIndex = mergedBreeds.indexOf(breed);
    mergedCounts[mergedIndex] += newCounts[index];
  });

  return mergedCounts;
}

// =================================================
// Helper function for the API actions
// - merging pet data for uploading the battle logs
// =================================================
export function mergePetData(
  existing: LeaguePetData['pet_data'],
  newData: LeaguePetData['pet_data'],
) {
  return {
    name: existing.name,
    type: existing.type,
    stats: [...new Set([...existing.stats, ...newData.stats])],
    breeds: [...new Set([...existing.breeds, ...newData.breeds])],
    times_played: mergeBreedPlayCounts(
      existing.breeds,
      existing.times_played,
      newData.breeds,
      newData.times_played,
    ),
  };
}
