// =================================================
// Helper function for the battle logs actions
// - to transform the data for pet swap statistics
// =================================================
export function transformPetSwapData(
  petSwapDetails: Record<string, number>,
): { name: string; value: number }[] {
  return Object.entries(petSwapDetails)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value); // Sort by swap count descending
}
