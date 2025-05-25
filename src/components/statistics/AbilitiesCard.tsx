'use client';

import { useState } from 'react';
import { abilitiesCategoryNames } from '@/utils/analyzeToolHelpers';
import { AbilitiesPopup } from './AbilitiesPopup';
import { Modal, Heading, Paragraph } from '@/components/ui';

export function AbilitiesCard({
  category,
  abilities,
}: {
  category: string;
  abilities: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className='bg-background p-5 rounded-lg shadow-md w-full flex flex-wrap items-start justify-between cursor-pointer lg:hover:scale-[1.03] lg:hover:transition-all lg:hover:duration-500'
        onClick={() => setIsOpen(true)}
      >
        <div className='w-[40%]'>
          <Heading as='h3' className='text-xl'>
            {abilitiesCategoryNames[
              category as keyof typeof abilitiesCategoryNames
            ] || category}
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
      <Modal
        show={isOpen}
        onClose={() => setIsOpen(false)}
        className='bg-light-grey'
      >
        <AbilitiesPopup category={category} abilities={abilities} />
      </Modal>
    </>
  );
}
