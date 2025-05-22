'use client';

import { useState } from 'react';
import { abilitiesCategoryNames } from '@/utils/analyzeToolHelpers';
import { AbilityPopup } from './AbilityPopup';

export function AbilitiesCard({
  category,
  abilities,
}: {
  category: string;
  abilities: string[];
}) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <>
      <div className='bg-background p-5 rounded-lg shadow-md w-full flex flex-wrap items-start justify-between'>
        <div className='w-[40%]'>
          <h3 className='text-xl text-muted-foreground'>
            {abilitiesCategoryNames[
              category as keyof typeof abilitiesCategoryNames
            ] || category}
          </h3>
          <p className='text-4xl text-humanoid font-bold mb-2.5'>
            {abilities.length}
          </p>
        </div>
        <div className='w-0.5 h-full bg-light-grey rounded-full' />
        <div className='space-y-1 w-[40%]'>
          {abilities.slice(0, 3).map((ability) => (
            <p key={ability} className='text-sm'>
              {ability}
            </p>
          ))}
          {abilities.length > 3 && (
            <p className='text-sm text-muted-foreground text-humanoid'>
              {'+'}
              {abilities.length - 3}
              {' more...'}
            </p>
          )}
        </div>
      </div>

      <AbilityPopup
        category={category}
        abilities={abilities}
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </>
  );
}
