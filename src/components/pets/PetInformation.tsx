'use client';

import Image from 'next/image';
import { PET_TYPE_IMAGES, PetInformationProps } from '@/types/supabase.types';
import { Heading, Paragraph } from '@/components/ui';
import { useTooltip } from '@/context/TooltipContext';

export function PetInformation({
  pet,
  petTypeColor,
  family,
}: PetInformationProps) {
  const { showFamilyTooltip, hideTooltip, updatePosition } = useTooltip();

  return (
    <div>
      <Heading as='h2' className='mb-2.5' style={{ color: petTypeColor }}>
        {'Information'}
      </Heading>
      <div className='grid grid-cols-3 gap-5'>
        <div>
          <Paragraph className='text-sm text-foreground/60'>{'Type'}</Paragraph>
          <div
            className='cursor-pointer'
            onMouseEnter={(e) => showFamilyTooltip(family, e)}
            onMouseLeave={hideTooltip}
            onMouseMove={updatePosition}
          >
            <Paragraph className='flex items-center gap-2 text-md font-semibold'>
              {pet.type}
              <Image
                src={PET_TYPE_IMAGES[pet.type]}
                alt={pet.type}
                width={20}
                height={20}
                className='border border-foreground/80 p-0.5 rounded-full bg-background'
              />
            </Paragraph>
          </div>
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
