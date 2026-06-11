'use client';

import { useState } from 'react';
import Image from 'next/image';
import { abilitiesCategoryNames } from '@/lib/logs-data/abilitiesCategoryNames';
import { Modal } from './Modal';
import { Heading, Paragraph } from '@/components/ui';
import { AbilitiesCardProps } from '@/types/components.types';
import { FullAbility } from '@/types/supabase.types';
import { useTooltip } from '@/context/TooltipContext';
import { sbApiClient } from '@/lib/supabase/client';

export function AbilitiesCard({ category, abilities }: AbilitiesCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [abilitiesByName, setAbilitiesByName] = useState<
    Record<string, FullAbility>
  >({});
  const [loading, setLoading] = useState(false);
  const { showAbilityTooltip, hideTooltip, updatePosition } = useTooltip();

  async function handleOpen() {
    setIsOpen(true);

    // Only fetch if we haven't already
    if (Object.keys(abilitiesByName).length > 0) return;

    setLoading(true);
    try {
      const supabase = sbApiClient();
      const { data } = await supabase
        .schema('pets')
        .from('abilities')
        .select('*, families(*)')
        .in('name', abilities);

      if (data) {
        setAbilitiesByName(Object.fromEntries(data.map((a) => [a.name, a])));
      }
    } finally {
      setLoading(false);
    }
  }

  const categoryLabel =
    abilitiesCategoryNames[category as keyof typeof abilitiesCategoryNames] ||
    category;

  return (
    <>
      <div
        className='bg-background p-2.5 lg:p-5 rounded-lg shadow-md w-full flex flex-wrap items-start justify-between cursor-pointer lg:hover:scale-[1.03] lg:hover:transition-all lg:hover:duration-500'
        onClick={handleOpen}
      >
        <div className='w-[40%]'>
          <Heading as='h3' className='text-lg'>
            {categoryLabel}
          </Heading>
          <Paragraph className='text-4xl text-humanoid font-bold mb-2.5'>
            {abilities.length}
          </Paragraph>
        </div>
        <div className='w-0.5 h-full bg-light-grey rounded-full' />
        <div className='space-y-1 w-[40%]'>
          {abilities.slice(0, 3).map((ability) => (
            <Paragraph key={ability} className='text-sm'>
              {ability}
            </Paragraph>
          ))}
          {abilities.length > 3 && (
            <Paragraph className='text-sm text-muted-foreground text-humanoid'>
              {'+'}
              {abilities.length - 3}
              {' more...'}
            </Paragraph>
          )}
        </div>
      </div>
      <Modal show={isOpen} onClose={() => setIsOpen(false)}>
        <Heading as='h2' className='break-words mb-2.5'>
          {categoryLabel}
          {' Abilities'}
        </Heading>
        <div className='py-2.5 lg:py-5 bg-background rounded-lg shadow-md'>
          {loading ? (
            <Paragraph className='text-center p-5 text-muted-foreground'>
              {'Loading...'}
            </Paragraph>
          ) : (
            <ul>
              {abilities.map((abilityName, index) => {
                const ability = abilitiesByName[abilityName];
                return (
                  <li
                    key={`${ability}-${index}`}
                    className='px-2.5 lg:px-5 py-1.5 border-b border-light-grey last:border-none flex gap-2.5'
                    onMouseEnter={(e) =>
                      ability && showAbilityTooltip(ability, e)
                    }
                    onMouseLeave={hideTooltip}
                    onMouseMove={updatePosition}
                  >
                    <Image
                      src={ability?.icon ?? ''}
                      alt={abilityName}
                      width={18}
                      height={18}
                    />
                    {abilityName}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Modal>
    </>
  );
}
