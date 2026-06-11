/**
 * WarcraftPets URL pattern:
 * https://cdn.warcraftpets.com/abilities/{typeSlug}/{abilitySlug}/
 * typeSlug  = battle_pet_type.type.toLowerCase()  e.g. "dragonkin"
 * abilitySlug = ability name lowercased, spaces → hyphens e.g. "starfall"
 */
export async function buildWarcraftPetsUrl(
  abilityName: string,
  petType: string,
): Promise<string> {
  const typeSlug = petType.toLowerCase();
  const abilitySlug = abilityName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  return `https://cdn.warcraftpets.com/abilities/${typeSlug}/${abilitySlug}/`;
}
