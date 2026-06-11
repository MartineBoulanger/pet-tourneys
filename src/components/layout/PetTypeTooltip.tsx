import Image from 'next/image';
import { PET_TYPE_IMAGES, PetTypeTooltipProps } from '@/types/supabase.types';
import { LuArrowBigUpDash, LuArrowBigDownDash } from 'react-icons/lu';
import { Heading, Paragraph } from '@/components/ui';

export function PetTypeTooltip({ type, x, y }: PetTypeTooltipProps) {
  return (
    <div
      className='fixed z-[999] max-w-[400px] pointer-events-none'
      style={{ left: x + 12, top: y + 12 }}
    >
      <div className='flex flex-col justify-between p-5 rounded-lg bg-background/95 border border-foreground/80 gap-2.5 shadow-md'>
        <div className='flex items-center gap-5'>
          <Image
            src={PET_TYPE_IMAGES[type.type]}
            alt={type.type}
            height={40}
            width={40}
            className='border border-foreground/80 p-1 rounded-full bg-background'
          />
          <Heading as='h2' className='text-foreground tracking-wider'>
            {type.type}
          </Heading>
        </div>
        <div className='h-[1px] w-full bg-light-grey rounded-full' />
        <Paragraph>{type.passive}</Paragraph>
        <div className='h-[1px] w-full bg-light-grey rounded-full' />
        <div className='flex flex-col gap-1'>
          <Paragraph className='mb-1 font-semibold text-sm text-yellow'>
            {'Damage Taken'}
          </Paragraph>
          <Paragraph className='flex items-center gap-1'>
            <LuArrowBigUpDash className='text-green h-4 w-4' />
            <span>{'50% from'}</span>
            <span className='flex gap-1'>
              <Image
                src={PET_TYPE_IMAGES[type.takes_more_from || 'Beast']}
                alt={type.takes_more_from || 'take more damage from'}
                height={18}
                width={18}
                className='border border-foreground/80 p-0.5 rounded-full'
              />
              {type.takes_more_from}
            </span>
            <span>{'abilities'}</span>
          </Paragraph>
          <Paragraph className='flex items-center gap-1'>
            <LuArrowBigDownDash className='text-red h-4 w-4' />
            <span>{'33% from'}</span>
            <span className='flex gap-1'>
              <Image
                src={PET_TYPE_IMAGES[type.takes_less_from || 'Beast']}
                alt={type.takes_less_from || 'take less damage from'}
                height={18}
                width={18}
                className='border border-foreground/80 p-0.5 rounded-full'
              />
              {type.takes_less_from}
            </span>
            <span>{'abilities'}</span>
          </Paragraph>
        </div>
      </div>
    </div>
  );
}
