import { Pet, PET_TYPE_COLORS } from '@/types/supabase.types';
import { Heading, Paragraph } from '@/components/ui';

export function PetDescription({
  pet,
  petTypeColor,
}: {
  pet: Pet;
  petTypeColor: PET_TYPE_COLORS;
}) {
  return (
    pet.description && (
      <div className='md:mt-10 max-w-[720px]'>
        <Heading as='h2' className='mb-2.5' style={{ color: petTypeColor }}>
          {'Description'}
        </Heading>
        <Paragraph className='text-lg'>{pet.description}</Paragraph>
      </div>
    )
  );
}
