'use client';

import { useState } from 'react';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';

import type { TabProps } from '@/types/rematch-import.types';

import { CopyButton } from './CopyButton';
import { TeamCard } from './TeamCard';
import { Button, Paragraph } from '@/components/ui';

export function Tab({ tab, forceOpen = false }: TabProps) {
  const [isOpen, setIsOpen] = useState(true);

  const open = forceOpen || isOpen;

  return (
    <div className='rounded-md overflow-hidden'>
      <Button
        type='button'
        aria-expanded={open}
        aria-controls={`rematch-tab-${tab.id}`}
        onClick={() => {
          if (!forceOpen) {
            setIsOpen((current) => !current);
          }
        }}
        className='w-full flex items-center gap-5 p-2.5 bg-light-grey hover:bg-medium-grey rounded-none'
      >
        <span
          aria-hidden='true'
          className='size-2.5 shrink-0 rounded-full'
          style={{
            backgroundColor: tab.color ? `#${tab.color}` : '#101010',
          }}
        />

        <span className='text-xl'>{tab.name}</span>

        <span className='text-xs text-foreground/60 normal-case'>
          <span className='text-humanoid font-semibold'>
            {tab.teams.length}
          </span>
          {tab.teams.length === 1 ? ' team' : ' teams'}
        </span>

        <span
          aria-hidden='true'
          className='ml-auto transition-all duration-500'
        >
          {open ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
        </span>
      </Button>

      {open && (
        <div id={`rematch-tab-${tab.id}`}>
          <div className='bg-light-grey px-2.5 pt-2.5 lg:px-5'>
            <div className='mb-2.5 flex flex-wrap items-center justify-between gap-2.5'>
              <Paragraph className='text-sm tracking-wider text-foreground font-bold'>
                {'Whole tab'}
                <span className='text-humanoid'>{' - '}</span>
                {`all ${tab.teams.length} ${tab.teams.length === 1 ? 'team' : 'teams'}`}
              </Paragraph>

              <CopyButton text={tab.exportBlock}>{'Copy tab'}</CopyButton>
            </div>

            <pre className='max-h-24 overflow-y-auto whitespace-pre-wrap break-words rounded-lg  bg-background p-2.5 lg:p-5 text-sm'>
              {tab.exportBlock}
            </pre>
          </div>

          {tab.teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}
    </div>
  );
}
