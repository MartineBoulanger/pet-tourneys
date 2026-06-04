import Image from 'next/image';
import { PET_TYPE_IMAGES, AbilityTooltipProps } from '@/types/supabase.types';
import { LuArrowBigUpDash, LuArrowBigDownDash } from 'react-icons/lu';
import { Heading, Paragraph } from '@/components/ui';

export function AbilityTooltip({ ability, x, y }: AbilityTooltipProps) {
  return (
    <div
      className='fixed z-50 max-w-[400px] pointer-events-none'
      style={{ left: x + 12, top: y + 12 }}
    >
      <div className='flex flex-col justify-between p-5 rounded-lg bg-background/95 border border-foreground/80 gap-2.5 shadow-md'>
        <div className='flex items-center justify-between gap-5'>
          <div className='flex items-center gap-5'>
            {ability.icon && (
              <Image
                src={ability.icon}
                alt={ability.name}
                height={40}
                width={40}
              />
            )}
            <Heading as='h2' className='text-foreground tracking-wider'>
              {ability.name}
            </Heading>
          </div>
          <Image
            src={PET_TYPE_IMAGES[ability.type]}
            alt={ability.type}
            height={40}
            width={40}
            className='border border-foreground/80 p-1 rounded-full bg-black'
          />
        </div>
        <div className='h-[1px] w-full bg-light-grey rounded-full' />
        <div>
          {ability.rounds === 1 ? null : (
            <Paragraph>
              {ability.rounds}
              {' rounds ability'}
            </Paragraph>
          )}
          {ability.cooldown && (
            <Paragraph>
              {ability.cooldown}
              {' rounds cooldown'}
            </Paragraph>
          )}
        </div>
        {ability.hit_chance && (
          <Paragraph className='text-yellow'>{`${ability.hit_chance}% hit chance`}</Paragraph>
        )}
        {ability.description && <p>{ability.description}</p>}
        {ability.effect && <p>{ability.effect}</p>}
        <div className='h-[1px] w-full bg-light-grey rounded-full' />
        {ability.families && (
          <>
            <Paragraph className='flex items-center gap-2'>
              <LuArrowBigUpDash className='text-green h-4.5 w-4.5' />
              <span className='mx-2'>{'vs'}</span>
              <span className='flex gap-1'>
                <Image
                  src={PET_TYPE_IMAGES[ability.families.strong_vs || 'Beast']}
                  alt={ability.type}
                  height={18}
                  width={18}
                  className='border border-foreground/80 p-0.5 rounded-full bg-black'
                />
                {ability.families.strong_vs}
              </span>
            </Paragraph>
            <Paragraph className='flex items-center gap-2'>
              <LuArrowBigDownDash className='text-red h-4.5 w-4.5' />
              <span className='mx-2'>{'vs'}</span>
              <span className='flex gap-1'>
                <Image
                  src={PET_TYPE_IMAGES[ability.families.weak_vs || 'Beast']}
                  alt={ability.type}
                  height={18}
                  width={18}
                  className='border border-foreground/80 p-0.5 rounded-full bg-black'
                />
                {ability.families.weak_vs}
              </span>
            </Paragraph>
          </>
        )}
      </div>
    </div>
  );
}
