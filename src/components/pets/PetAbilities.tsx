'use client';

import Image from 'next/image';
import { Pet, PetAbilitiesProps } from '@/types/supabase.types';
import { Heading, Paragraph } from '@/components/ui';
import { useTooltip } from '@/context/TooltipContext';

export function PetAbilities({
  pet,
  petTypeColor,
  abilities,
}: PetAbilitiesProps) {
  const { showAbilityTooltip, hideTooltip, updatePosition } = useTooltip();

  const ABILITY_LEVELS: Record<string, string> = {
    ability_1: 'Lvl 1',
    ability_2: 'Lvl 2',
    ability_3: 'Lvl 4',
    ability_4: 'Lvl 10',
    ability_5: 'Lvl 15',
    ability_6: 'Lvl 20',
  };

  const ABILITY_ORDER = [
    'ability_1',
    'ability_4',
    'ability_2',
    'ability_5',
    'ability_3',
    'ability_6',
  ];

  const hasAnyAbility = ABILITY_ORDER.some((key) => pet[key as keyof Pet]);
  if (!hasAnyAbility) return null;

  return (
    <>
      <div className='rounded-full w-full max-w-[600px] h-[2px] my-5 bg-medium-grey' />
      <Heading as='h2' className='mb-5' style={{ color: petTypeColor }}>
        {'Abilities'}
      </Heading>
      <div className='grid grid-cols-2 gap-2.5 max-w-[650px]'>
        {ABILITY_ORDER.map((key) => {
          const name = pet[key as keyof Pet] as string | null;
          const ability = abilities[key];
          if (!name) return null;
          return (
            <div
              key={key}
              className='cursor-pointer'
              onMouseEnter={(e) => showAbilityTooltip(ability, e)}
              onMouseLeave={hideTooltip}
              onMouseMove={updatePosition}
            >
              <Paragraph className='flex gap-1.5'>
                <span className='text-foreground/60'>
                  {`${ABILITY_LEVELS[key]} -`}
                </span>
                <span className='flex gap-1.5'>
                  <Image
                    src={ability.icon ?? ''}
                    alt={name}
                    width={18}
                    height={18}
                  />
                  {name}
                </span>
              </Paragraph>
            </div>
          );
        })}
      </div>
    </>
  );
}
