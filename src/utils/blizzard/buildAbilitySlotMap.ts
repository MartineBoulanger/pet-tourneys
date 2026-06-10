import { FullAbility, Pet } from '@/types/supabase.types';

export function buildAbilitySlotMap(
  pet: Pet,
  abilitiesByName: Record<string, FullAbility>,
): Record<string, FullAbility> {
  return {
    ...(pet.ability_1 &&
      abilitiesByName[pet.ability_1] && {
        ability_1: abilitiesByName[pet.ability_1],
      }),
    ...(pet.ability_2 &&
      abilitiesByName[pet.ability_2] && {
        ability_2: abilitiesByName[pet.ability_2],
      }),
    ...(pet.ability_3 &&
      abilitiesByName[pet.ability_3] && {
        ability_3: abilitiesByName[pet.ability_3],
      }),
    ...(pet.ability_4 &&
      abilitiesByName[pet.ability_4] && {
        ability_4: abilitiesByName[pet.ability_4],
      }),
    ...(pet.ability_5 &&
      abilitiesByName[pet.ability_5] && {
        ability_5: abilitiesByName[pet.ability_5],
      }),
    ...(pet.ability_6 &&
      abilitiesByName[pet.ability_6] && {
        ability_6: abilitiesByName[pet.ability_6],
      }),
  };
}
