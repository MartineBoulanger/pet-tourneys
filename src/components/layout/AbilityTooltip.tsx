import Image from 'next/image';
import { FullAbility, PET_TYPE_IMAGES } from '@/types/supabase.types';
import { LuArrowBigUpDash, LuArrowBigDownDash } from 'react-icons/lu';

export function AbilityTooltip({
  ability,
  x,
  y,
}: {
  ability: FullAbility;
  x: number;
  y: number;
}) {
  return (
    <div
      className='fixed z-50 max-w-[400px] pointer-events-none'
      style={{ left: x + 12, top: y + 12 }}
    >
      <div className='flex flex-col justify-between p-5 rounded-lg bg-background border border-foreground/80 gap-2.5 shadow-md'>
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
            <h2 className='text-foreground tracking-wider'>{ability.name}</h2>
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
            <p>
              {ability.rounds}
              {' rounds ability'}
            </p>
          )}
          {ability.cooldown && (
            <p>
              {ability.cooldown}
              {' rounds cooldown'}
            </p>
          )}
        </div>
        <p className='text-yellow'>{`${ability.hit_chance}% hit chance`}</p>
        <p>{ability.description}</p>
        <p>{ability.effect}</p>
        <div className='h-[1px] w-full bg-light-grey rounded-full' />
        {ability.families && (
          <>
            <p className='flex items-center gap-2'>
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
            </p>
            <p className='flex items-center gap-2'>
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
            </p>
          </>
        )}
      </div>
    </div>
  );
}
