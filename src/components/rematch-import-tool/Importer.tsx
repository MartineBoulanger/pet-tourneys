'use client';

import { useState } from 'react';

import { Button, Input, Paragraph } from '@/components/ui';

import { FileDropZone } from './FileDropZone';
import { Tab } from './Tab';
import { CopyButton } from './CopyButton';
import { LevellingQueue } from './LevellingQueue';

import { useRematchImport } from '@/hooks/useRematchImport';

type ImportView = 'teams' | 'levelling-queue';

export function Importer() {
  const {
    data,
    queueExport,
    query,
    setQuery,
    status,
    error,
    isReading,
    filteredTabs,
    shownTeamCount,
    handleFiles,
  } = useRematchImport();

  const [view, setView] = useState<ImportView>('teams');

  const isFiltering = query.trim().length > 0;

  const allTabsExport = data
    ? data.tabs.map((tab) => tab.exportBlock).join('\n\n')
    : '';

  const queueCount = data?.queue?.pets.length ?? 0;

  return (
    <div>
      <FileDropZone onFiles={handleFiles} disabled={isReading} />

      {(status || error) && (
        <Paragraph
          aria-live='polite'
          className={`my-5 rounded-lg p-2.5 text-center text-sm ${
            error
              ? 'bg-light-red text-dark-red'
              : 'bg-light-green text-dark-green'
          }`}
        >
          {error ?? status}
        </Paragraph>
      )}

      {data && (
        <div className='rounded-lg bg-background p-2.5 shadow-md lg:p-5'>
          {/* Main view tabs */}
          <div
            role='tablist'
            className='flex gap-2.5 border-b border-medium-grey'
          >
            <Button
              type='button'
              role='tab'
              variant='link'
              aria-selected={view === 'teams'}
              onClick={() => setView('teams')}
              className={`
                                px-4 py-2.5 border-b-2 border-transparent
                                ${
                                  view === 'teams'
                                    ? 'border-b-2 border-humanoid text-foreground rounded-none'
                                    : 'text-muted-foreground'
                                }
                            `}
            >
              {'Teams'}
              <span className='ml-2 text-xs text-humanoid'>
                {data.teamCount}
              </span>
            </Button>

            <Button
              type='button'
              role='tab'
              variant='link'
              aria-selected={view === 'levelling-queue'}
              onClick={() => setView('levelling-queue')}
              className={`
                                px-4 py-2.5 border-b-2 border-transparent
                                ${
                                  view === 'levelling-queue'
                                    ? 'border-b-2 border-humanoid text-foreground rounded-none'
                                    : 'text-muted-foreground'
                                }
                            `}
            >
              {'Levelling Queue'}
              <span className='ml-2 text-xs text-humanoid'>{queueCount}</span>
            </Button>
          </div>

          {view === 'teams' && (
            <div className='pt-5'>
              <div>
                <Paragraph>
                  {
                    'You can choose how you want to import your teams into PetMatch, or if you decide to backup all the teams, you can paste the whole import string in a .txt file and saave it on your computer. If you prefer to import everything at once, you can click on the button "Copy Everything", then you can import everything in PetMatch. If you prefer to import per folder, you can click on the button "Copy Tab", then you can import the folder with its teams in PetMatch. If you prefer to import per team, or you only need just one team, you can click on the button "Copy", then you can import this single team in PetMatch.'
                  }
                </Paragraph>
                <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
              </div>
              <div className='flex flex-wrap items-center justify-between gap-5'>
                <Paragraph className='text-sm tracking-wider text-foreground'>
                  <span className='font-bold text-humanoid'>
                    {shownTeamCount}
                  </span>

                  {` of ${data.teamCount} teams · ${data.tabs.length} ${
                    data.tabs.length === 1 ? 'tab' : 'tabs'
                  }`}
                </Paragraph>

                <div className='flex items-center gap-5'>
                  <Input
                    type='search'
                    id='search-import'
                    name='search-input'
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder='Search tabs, teams, pets, NPCs...'
                    className='lg:w-[500px]'
                  />

                  <CopyButton text={allTabsExport}>
                    {'Copy everything'}
                  </CopyButton>
                </div>
              </div>

              <div className='mx-auto my-5 h-0.5 w-full rounded-full bg-medium-grey' />

              {filteredTabs.length === 0 ? (
                <Paragraph className='rounded-lg bg-background p-2.5 text-center text-foreground shadow-md'>
                  {'No team matches that filter.'}
                </Paragraph>
              ) : (
                <div className='space-y-2.5'>
                  {filteredTabs.map((tab) => (
                    <Tab key={tab.id} tab={tab} forceOpen={isFiltering} />
                  ))}
                </div>
              )}
            </div>
          )}

          {view === 'levelling-queue' && (
            <LevellingQueue queue={data.queue} exportData={queueExport} />
          )}
        </div>
      )}
    </div>
  );
}
