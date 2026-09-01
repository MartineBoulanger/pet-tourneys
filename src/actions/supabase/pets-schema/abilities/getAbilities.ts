'use server';

import { abilitiesTable, petsTable } from '@/actions/supabase/actions';
import { PetAbilitiesBySpecies } from '@/types/rematch-import.types';

// =================================================
// Get abilities per pet by pet name
// =================================================
export async function getAbilitiesByNames(names: string[]) {
  try {
    const abs = await abilitiesTable();
    const { data, error } = await abs
      .select(`*, families(*)`)
      .in('name', names);
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (error) {
    console.error('Get Pet Ability Error:', error);
    return { success: false, error: (error as Error).message };
  }
}

export const getPetAbilitiesBySpeciesIds = async (speciesIds: number[]) => {
  try {
    const uniqueSpeciesIds = [...new Set(speciesIds)];

    if (!uniqueSpeciesIds.length) {
      return {
        success: true,
        data: {} as PetAbilitiesBySpecies,
      };
    }

    const pets = await petsTable();

    const { data: petData, error: petsError } = await pets
      .select(
        `
        id,
        ability_1,
        ability_2,
        ability_3,
        ability_4,
        ability_5,
        ability_6
      `,
      )
      .in('id', uniqueSpeciesIds);

    if (petsError) {
      return {
        success: false,
        error: petsError.message,
      };
    }

    const abilityNames = [
      ...new Set(
        (petData ?? []).flatMap((pet) => [
          pet.ability_1,
          pet.ability_2,
          pet.ability_3,
          pet.ability_4,
          pet.ability_5,
          pet.ability_6,
        ]),
      ),
    ].filter((name): name is string => Boolean(name));

    if (!abilityNames.length) {
      return {
        success: true,
        data: {} as PetAbilitiesBySpecies,
      };
    }

    const abilitiesResult = await getAbilitiesByNames(abilityNames);

    if (!abilitiesResult.success) {
      return {
        success: false,
        error: abilitiesResult.error,
      };
    }

    const abilityIdsByName = new Map<string, number>();

    for (const ability of abilitiesResult.data ?? []) {
      abilityIdsByName.set(ability.name, ability.id);
    }

    const result: PetAbilitiesBySpecies = {};

    for (const pet of petData ?? []) {
      result[pet.id] = [
        pet.ability_1 ? (abilityIdsByName.get(pet.ability_1) ?? null) : null,
        pet.ability_2 ? (abilityIdsByName.get(pet.ability_2) ?? null) : null,
        pet.ability_3 ? (abilityIdsByName.get(pet.ability_3) ?? null) : null,
        pet.ability_4 ? (abilityIdsByName.get(pet.ability_4) ?? null) : null,
        pet.ability_5 ? (abilityIdsByName.get(pet.ability_5) ?? null) : null,
        pet.ability_6 ? (abilityIdsByName.get(pet.ability_6) ?? null) : null,
      ];
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
};
