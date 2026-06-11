import { PetInformationProps } from '@/types/supabase.types';
import { Heading, Paragraph } from '@/components/ui';
import { PetType } from '@/components/pets/PetType';

export function PetInformation({
  pet,
  petTypeColor,
  family,
}: PetInformationProps) {
  return (
    <div>
      <Heading as='h2' className='mb-2.5' style={{ color: petTypeColor }}>
        {'Information'}
      </Heading>
      <div className='grid grid-cols-3 gap-5'>
        <div>
          <Paragraph className='text-sm text-foreground/60'>{'Type'}</Paragraph>
          <PetType type={pet.type} family={family} className='font-semibold' />
        </div>

        <div>
          <Paragraph className='text-sm text-foreground/60'>
            {'Expansion'}
          </Paragraph>
          <Paragraph className='text-md font-semibold'>
            {pet.expansion}
          </Paragraph>
        </div>

        <div>
          <Paragraph className='text-sm text-foreground/60'>
            {'Source'}
          </Paragraph>
          <Paragraph className='text-md font-semibold'>
            {pet.source || 'Unknown'}
          </Paragraph>
        </div>

        <div>
          <Paragraph className='text-sm text-foreground/60'>
            {'Is Tradable?'}
          </Paragraph>
          <Paragraph className='text-md font-semibold'>
            {pet.is_tradable ? 'Yes' : 'No'}
          </Paragraph>
        </div>

        <div>
          <Paragraph className='text-sm text-foreground/60'>
            {'Is Capturable?'}
          </Paragraph>
          <Paragraph className='text-md font-semibold'>
            {pet.is_capturable ? 'Yes' : 'No'}
          </Paragraph>
        </div>

        <div>
          <Paragraph className='text-sm text-foreground/60'>
            {'Can battle?'}
          </Paragraph>
          <Paragraph className='text-md font-semibold'>
            {!pet.is_vanity ? 'Yes' : 'No'}
          </Paragraph>
        </div>
      </div>
    </div>
  );
}
