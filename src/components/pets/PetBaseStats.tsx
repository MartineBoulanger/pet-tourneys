import { Pet, PET_TYPE_COLORS } from '@/types/supabase.types';
import { Heading, Paragraph } from '@/components/ui';

export function PetBaseStats({
  pet,
  petTypeColor,
}: {
  pet: Pet;
  petTypeColor: PET_TYPE_COLORS;
}) {
  return (
    <div>
      <Heading as='h2' className='mb-2.5' style={{ color: petTypeColor }}>
        {'Base stats'}
      </Heading>
      <div className='grid grid-cols-3 gap-5'>
        <div>
          <Paragraph className='text-sm text-foreground/60'>
            {'Health'}
          </Paragraph>
          <Paragraph className='text-md font-semibold'>
            {pet.base_health || 'N/A'}
          </Paragraph>
        </div>
        <div>
          <Paragraph className='text-sm text-foreground/60'>
            {'Power'}
          </Paragraph>
          <Paragraph className='text-md font-semibold'>
            {pet.base_power || 'N/A'}
          </Paragraph>
        </div>
        <div>
          <Paragraph className='text-sm text-foreground/60'>
            {'Speed'}
          </Paragraph>
          <Paragraph className='text-md font-semibold'>
            {pet.base_speed || 'N/A'}
          </Paragraph>
        </div>
      </div>
    </div>
  );
}
