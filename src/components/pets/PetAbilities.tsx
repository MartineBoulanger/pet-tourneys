import { Pet, PET_TYPE_COLORS } from '@/types/supabase.types';
import { Heading, Paragraph } from '@/components/ui';

export function PetAbilities({
  pet,
  petTypeColor,
}: {
  pet: Pet;
  petTypeColor: PET_TYPE_COLORS;
}) {
  return (
    (pet.ability_1 ||
      pet.ability_2 ||
      pet.ability_3 ||
      pet.ability_4 ||
      pet.ability_5 ||
      pet.ability_6) && (
      <div>
        <div className='rounded-full w-full max-w-[720px] h-[2px] my-5 bg-medium-grey' />
        <Heading as='h2' className='mb-5' style={{ color: petTypeColor }}>
          {'Abilities'}
        </Heading>
        <div className='grid grid-cols-2 gap-5'>
          {pet.ability_1 && (
            <Paragraph>
              <span className='text-foreground/60'>{'Lvl 1 - '}</span>
              {pet.ability_1}
            </Paragraph>
          )}
          {pet.ability_2 && (
            <Paragraph>
              <span className='text-foreground/60'>{'Lvl 2 - '}</span>
              {pet.ability_2}
            </Paragraph>
          )}
          {pet.ability_3 && (
            <Paragraph>
              <span className='text-foreground/60'>{'Lvl 4 - '}</span>
              {pet.ability_3}
            </Paragraph>
          )}
          {pet.ability_4 && (
            <Paragraph>
              <span className='text-foreground/60'>{'Lvl 10 - '}</span>
              {pet.ability_4}
            </Paragraph>
          )}
          {pet.ability_5 && (
            <Paragraph>
              <span className='text-foreground/60'>{'Lvl 15 - '}</span>
              {pet.ability_5}
            </Paragraph>
          )}
          {pet.ability_6 && (
            <Paragraph>
              <span className='text-foreground/60'>{'Lvl 20 - '}</span>
              {pet.ability_6}
            </Paragraph>
          )}
        </div>
      </div>
    )
  );
}
