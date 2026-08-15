'use client';

import { Input, Paragraph } from '@/components/ui';
import { FileDropZone } from './FileDropZone';
import { Tab } from './Tab';
import { useRematchImport } from '@/hooks/useRematchImport';
import { CopyButton } from './CopyButton';

export function Importer() {
  const {
    data,
    query,
    setQuery,
    status,
    error,
    isReading,
    filteredTabs,
    shownTeamCount,
    handleFiles,
  } = useRematchImport();

  const isFiltering = query.trim().length > 0;
  const allTabsExport = data
    ? data.tabs.map((tab) => tab.exportBlock).join('\n\n')
    : '';

  return (
    <div>
      <FileDropZone onFiles={handleFiles} disabled={isReading} />

      {(status || error) && (
        <Paragraph
          aria-live='polite'
          className={`my-5 text-center text-sm ${
            error
              ? 'bg-light-red text-dark-red p-2.5 rounded-lg'
              : 'bg-light-green text-dark-green p-2.5 rounded-lg'
          }`}
        >
          {error ?? status}
        </Paragraph>
      )}

      {data && (
        <div className='bg-background shadow-md rounded-lg p-2.5 lg:p-5'>
          <div className='flex flex-wrap items-center justify-between gap-5'>
            <Paragraph className='text-sm tracking-wider text-foreground'>
              <span className='text-humanoid font-bold'>{shownTeamCount}</span>
              {` of ${data.teamCount} teams · ${data.tabs.length} ${data.tabs.length === 1 ? 'tab' : 'tabs'}`}
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

              <CopyButton text={allTabsExport}>{'Copy everything'}</CopyButton>
            </div>
          </div>

          <div className='rounded-full w-full h-0.5 my-5 mx-auto bg-medium-grey' />

          {filteredTabs.length === 0 ? (
            <Paragraph className='bg-background text-foreground shadow-md rounded-lg p-2.5 text-center'>
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
    </div>
  );
}
