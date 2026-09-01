import { getPetAbilitiesBySpeciesIds } from '@/actions/supabase/pets-schema/abilities/getAbilities';
import type {
  PetAbilitiesBySpecies,
  RematchImportData,
  RematchPetTagParts,
  ResolvedPetAbilities,
} from '@/types/rematch-import.types';

export function resolvePetAbilities(
  decodedTag: RematchPetTagParts | null,
  speciesAbilities: PetAbilitiesBySpecies,
): ResolvedPetAbilities | null {
  if (!decodedTag || decodedTag.type !== 'pet') {
    return null;
  }

  const abilities = speciesAbilities[decodedTag.species];

  if (!abilities) {
    return [null, null, null];
  }

  return decodedTag.abilities.map((choice, slotIndex) => {
    if (choice === 0) {
      return null;
    }

    const abilityIndex = choice === 2 ? slotIndex + 3 : slotIndex;

    return abilities[abilityIndex] ?? null;
  }) as ResolvedPetAbilities;
}

export async function addAbilitiesToRematchData(
  data: RematchImportData,
): Promise<RematchImportData> {
  const speciesIds = [
    ...new Set(
      data.tabs.flatMap((tab) =>
        tab.teams.flatMap((team) =>
          team.decodedPetTags
            .filter((tag) => tag !== null && tag.type === 'pet')
            .map((tag) => tag.species),
        ),
      ),
    ),
  ];

  if (!speciesIds.length) {
    return data;
  }

  const abilitiesResult = await getPetAbilitiesBySpeciesIds(speciesIds);

  if (!abilitiesResult.success || !abilitiesResult.data) {
    throw new Error(abilitiesResult.error ?? 'Could not load pet abilities.');
  }

  const speciesAbilities: PetAbilitiesBySpecies = abilitiesResult.data;

  return {
    ...data,
    tabs: data.tabs.map((tab) => ({
      ...tab,

      teams: tab.teams.map((team) => ({
        ...team,

        abilities: team.decodedPetTags
          .map((tag) => resolvePetAbilities(tag, speciesAbilities))
          .filter(
            (abilities): abilities is ResolvedPetAbilities =>
              abilities !== null,
          ),
      })),
    })),
  };
}
