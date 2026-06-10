import { Alliance } from '@/assets/Alliance';
import { Horde } from '@/assets/Horde';
import { Pet, PET_TYPE_COLORS, Family } from '@/types/supabase.types';
import { PetImage, PetTypeImage } from './PetMedia';
import { PetInformation } from './PetInformation';
import { PetBaseStats } from './PetBaseStats';
import { PetBreeds } from './PetBreeds';
import { PetAbilities } from './PetAbilities';
import { PetDescription } from './PetDescription';
import { getAbilitiesByNames } from '@/actions/supabase/pets-schema/abilities/getAbilities';
import { getPetType } from '@/actions/supabase/pets-schema/families/getFamilies';
import Link from 'next/link';
import { buildAbilitySlotMap } from '@/utils/blizzard/buildAbilitySlotMap';

export async function PetDetails({ pet }: { pet: Pet }) {
  const petTypeColor =
    PET_TYPE_COLORS[pet.type as keyof typeof PET_TYPE_COLORS];

  const abilityNames = [
    pet.ability_1,
    pet.ability_2,
    pet.ability_3,
    pet.ability_4,
    pet.ability_5,
    pet.ability_6,
  ].filter((n): n is string => !!n);

  const [abilitiesResult, familyResult] = await Promise.all([
    getAbilitiesByNames(abilityNames),
    getPetType(pet.type),
  ]);

  const { success, data, error } = abilitiesResult;
  if (!success && error) throw new Error(error);

  const abilitiesByName = Object.fromEntries(
    (data ?? []).map((a) => [a.name, a]),
  );

  const abilities = buildAbilitySlotMap(pet, abilitiesByName);

  const { success: typeSucc, data: familyData, error: typeErr } = familyResult;
  if (!typeSucc && typeErr) throw new Error(typeErr);
  const family = familyData as Family;

  return (
    <>
      <div className='bg-background p-2.5 lg:p-5 rounded-lg relative'>
        <div className='grid md:grid-cols-2 gap-2.5 lg:gap-5'>
          {/* Image */}
          <PetImage pet={pet} />
          {/* Details */}
          <div className='space-y-2.5 lg:space-y-5 mt-2.5'>
            <PetInformation
              pet={pet}
              petTypeColor={petTypeColor}
              family={family}
            />
            <div className='rounded-full w-full h-[2px] my-5 bg-medium-grey' />
            <PetBaseStats pet={pet} petTypeColor={petTypeColor} />
            <div className='rounded-full w-full h-[2px] my-5 bg-medium-grey' />
            <PetBreeds pet={pet} petTypeColor={petTypeColor} />
            <div className='md:hidden rounded-full w-full h-[2px] my-5 mx-auto bg-medium-grey' />
            {(pet.is_horde || pet.is_alliance) && (
              <div className='absolute top-2 lg:top-5 right-2 lg:right-5'>
                {pet.is_horde && <Horde className='w-20 h-20' />}
                {pet.is_alliance && <Alliance className='w-20 h-20' />}
              </div>
            )}
          </div>
        </div>
        {/* Description */}
        <PetDescription pet={pet} petTypeColor={petTypeColor} />
        {/* Abilities */}
        <PetAbilities
          pet={pet}
          petTypeColor={petTypeColor}
          abilities={abilities}
          showHeading
        />
        {/* Pet Type Image on background */}
        <PetTypeImage pet={pet} />
      </div>
      <div className='flex justify-end mt-5'>
        <Link
          href='/pets'
          className='btn-submit flex items-center gap-2.5 py-[7px] px-[11px] rounded-lg'
          title={'Back To Overview'}
          aria-label={'Back To Overview'}
        >
          {'Back To Overview'}
        </Link>
      </div>
    </>
  );
}
