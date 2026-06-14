'use client';

import Image from 'next/image';
import { PetTypeProps, PET_TYPE_IMAGES } from '@/types/supabase.types';
import { Paragraph } from '@/components/ui';
import { useTooltip } from '@/context/TooltipContext';
import { cn } from '@/utils/cn';

export function PetType({ type, family, className }: PetTypeProps) {
  const { showFamilyTooltip, hideTooltip, updatePosition } = useTooltip();

  return (
    <div
      className='cursor-pointer'
      onMouseEnter={(e) => showFamilyTooltip(family, e)}
      onMouseLeave={hideTooltip}
      onMouseMove={updatePosition}
    >
      <Paragraph className={cn('flex items-center gap-2 text-md', className)}>
        {type}
        <Image
          src={PET_TYPE_IMAGES[type]}
          alt={type}
          width={20}
          height={20}
          className='w-5 h-5 border border-foreground/80 p-0.5 rounded-full bg-background'
          unoptimized
        />
      </Paragraph>
    </div>
  );
}
