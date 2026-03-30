'use client';

import { useState } from 'react';
import { abilitiesCategoryNames } from '@/lib/logs-data/abilitiesCategoryNames';
import { Modal } from './Modal';
import { Heading, Paragraph } from '@/components/ui';
import { AbilitiesCardProps } from '@/types/components.types';

export function AbilitiesCard({ category, abilities }: AbilitiesCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className='bg-background p-2.5 lg:p-5 rounded-lg shadow-md w-full flex flex-wrap items-start justify-between cursor-pointer lg:hover:scale-[1.03] lg:hover:transition-all lg:hover:duration-500'
        onClick={() => setIsOpen(true)}
      >
        <div className='w-[40%]'>
          <Heading as='h3' className='text-lg'>
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
      <Modal show={isOpen} onClose={() => setIsOpen(false)}>
        <Heading as='h2' className='break-words mb-2.5'>
          {abilitiesCategoryNames[
            category as keyof typeof abilitiesCategoryNames
          ] || category}
          {' Abilities'}
        </Heading>
        <div className='py-2.5 lg:py-5 bg-background rounded-lg shadow-md'>
          <ul>
            {abilities &&
              abilities.map((ability, index) => (
                <li
                  key={`${ability}-${index}`}
                  className='px-2.5 lg:px-5 py-1.5 border-b border-light-grey last:border-none'
                >
                  {ability}
                </li>
              ))}
          </ul>
        </div>
      </Modal>
    </>
  );
}
