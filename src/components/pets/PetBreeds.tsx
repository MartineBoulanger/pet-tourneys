import { Pet, PET_TYPE_COLORS } from '@/types/supabase.types';
import { Heading, Paragraph } from '@/components/ui';

export function PetBreeds({
  pet,
  petTypeColor,
}: {
  pet: Pet;
  petTypeColor: PET_TYPE_COLORS;
}) {
  return (
    <div>
      <Heading as='h2' className='mb-2.5' style={{ color: petTypeColor }}>
        {'Breeds'}
      </Heading>
      <Paragraph className='text-md font-semibold flex flex-wrap items-center gap-2.5'>
        {pet.breeds
          ? pet.breeds.map((b) => (
              <span
                key={b}
                className='py-1.5 px-2 rounded-lg'
                style={{ backgroundColor: petTypeColor }}
              >
                {b}
              </span>
            ))
          : 'None'}
      </Paragraph>
    </div>
  );
}
