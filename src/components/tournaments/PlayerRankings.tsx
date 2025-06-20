'use client';

import { useState } from 'react';
import { OverviewCard } from '@/components/statistics';
import {
  Heading,
  Paragraph,
  Button,
  Pagination,
  Tab,
  Tabs,
} from '@/components/ui';
import { PLAYERS_PER_PAGE } from '@/utils/constants';
import { PlayerRankingsProps } from './types';
import { EnhancedPlayerRecord } from '@/supabase/actions/players';
import { MedalIcon } from '@/assets/MedalIcon';

function sortPlayerRecords(
  records: EnhancedPlayerRecord[]
): EnhancedPlayerRecord[] {
  const sorted = [...records];

  return sorted.sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (a.losses !== b.losses) return a.losses - b.losses;
    return a.playerName.localeCompare(b.playerName);
  });
}

export const PlayerRankings = ({ records, regions }: PlayerRankingsProps) => {
  const [expandedPlayers, setExpandedPlayers] = useState<
    Record<string, boolean>
  >({});
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRegion, setCurrentRegion] = useState(regions[0] || '');

  const petData = `${process.env
    .NEXT_PUBLIC_BASE_URL!}/json-files/pets-data.json`;

  if (!regions || regions.length === 0) {
    return (
      <div className='py-10 text-center'>
        <Paragraph className='text-muted-foreground'>
          {'No regions available in data.'}
        </Paragraph>
      </div>
    );
  }

  const filteredRecords = records.filter(
    (player) => player.region === currentRegion
  );

  const sortedRecords = sortPlayerRecords(filteredRecords);
  const totalPages = Math.ceil(sortedRecords.length / PLAYERS_PER_PAGE);
  const currentRecords = sortedRecords.slice(
    (currentPage - 1) * PLAYERS_PER_PAGE,
    currentPage * PLAYERS_PER_PAGE
  );

  const togglePlayer = (playerName: string) => {
    setExpandedPlayers((prev) => ({
      ...prev,
      [playerName]: !prev[playerName],
    }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className='space-y-2.5 sm:space-y-5'>
      {currentRecords.length > 0 ? (
        <>
          <Tabs className='bg-light-grey'>
            {regions.map((region) => (
              <Tab
                key={region}
                active={currentRegion === region}
                onClick={() => setCurrentRegion(region)}
              >
                {region}
              </Tab>
            ))}
          </Tabs>
          <div className='space-y-2.5 sm:space-y-5 bg-background p-2.5 sm:p-5 rounded-lg shadow-md'>
            {currentRecords.map((player, index) => {
              const globalPosition =
                (currentPage - 1) * PLAYERS_PER_PAGE + index + 1;

              return (
                <div
                  key={player.playerName}
                  className='bg-light-grey hover:bg-medium-grey rounded-lg'
                >
                  <Button
                    onClick={() => togglePlayer(player.playerName)}
                    variant='link'
                    className='flex items-center justify-between w-full text-left p-2.5 sm:p-5 text-foreground'
                  >
                    <div className='flex items-center gap-2.5'>
                      <div className='flex items-center mr-2.5'>
                        {globalPosition <= 10 ? (
                          <MedalIcon
                            position={globalPosition}
                            className='w-6 h-6'
                          />
                        ) : (
                          <span className='font-bold text-muted-foreground'>
                            {globalPosition}.
                          </span>
                        )}
                      </div>
                      <Heading as='h3' className='text-xl'>
                        {player.playerName}
                      </Heading>
                    </div>
                    <span className='text-lg'>
                      {expandedPlayers[player.playerName] ? '-' : '+'}
                    </span>
                  </Button>

                  {expandedPlayers[player.playerName] && (
                    <div className='bg-light-grey p-2.5 sm:p-5 rounded-b-lg p-2.5 sm:p-5'>
                      <div className='flex flex-wrap flex-col md:flex-row gap-2.5 sm:gap-5 mb-2.5 sm:mb-5'>
                        <OverviewCard title='Matches Won' value={player.wins} />
                        <OverviewCard
                          title='Matches Lost'
                          value={player.losses}
                        />
                        <OverviewCard
                          title='Total Win Rate'
                          value={`${player.winRate}%`}
                        />
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-5'>
                        <div className='bg-background p-2.5 sm:p-5 rounded-lg'>
                          <Heading
                            as='h3'
                            className='text-xl text-muted-foreground mb-2.5'
                          >
                            {'Most Used Pet'}
                          </Heading>
                          {player.mostUsedPet.timesUsed > 0 ? (
                            <div>
                              <Paragraph className='text-md text-humanoid font-bold'>
                                {player.mostUsedPet.petName}
                              </Paragraph>
                              <Paragraph className='text-sm'>
                                {'Used '}
                                {player.mostUsedPet.timesUsed}
                                {' times'}
                              </Paragraph>
                              <Paragraph className='text-sm'>
                                {player.mostUsedPet.kills}
                                {' kills'}
                              </Paragraph>
                            </div>
                          ) : (
                            <Paragraph className='p-2.5 sm:p-5 rounded-lg bg-light-grey text-center shadow-md'>
                              {'No most used pet data found.'}
                            </Paragraph>
                          )}
                        </div>

                        <div className='bg-background p-2.5 sm:p-5 rounded-lg'>
                          <Heading
                            as='h3'
                            className='text-xl text-muted-foreground mb-2.5'
                          >
                            {'The Nemesis Pet'}
                          </Heading>
                          {player.mostProblematicPet.timesLostAgainst > 0 ? (
                            <div>
                              <Paragraph className='text-md text-humanoid font-bold'>
                                {player.mostProblematicPet.petName}
                              </Paragraph>
                              <Paragraph className='text-sm'>
                                {'Lost against '}
                                {player.mostProblematicPet.timesLostAgainst}
                                {' times'}
                              </Paragraph>
                            </div>
                          ) : (
                            <Paragraph className='p-2.5 sm:p-5 rounded-lg bg-light-grey text-center shadow-md'>
                              {'No nemesis pet data found.'}
                            </Paragraph>
                          )}
                        </div>
                      </div>

                      <div className='mt-2.5 sm:mt-5'>
                        <Heading as='h4' className='text-lg font-bold mb-2.5'>
                          {"Overall Player's Pet Usage"}
                        </Heading>
                        <div className='overflow-x-auto'>
                          <table className='min-w-full'>
                            <thead className='bg-background text-left'>
                              <tr className='border-b border-medium-grey'>
                                <th className='text-left py-2 px-4'>
                                  {'Pet Name'}
                                </th>
                                <th className='text-left py-2 px-4'>
                                  {'Times Used'}
                                </th>
                                <th className='text-left py-2 px-4'>
                                  {'Kills'}
                                </th>
                                <th className='text-left py-2 px-4'>
                                  {'Deaths'}
                                </th>
                              </tr>
                            </thead>
                            <tbody className='bg-medium-grey'>
                              {player.petStatistics.map((pet) => (
                                <tr
                                  key={pet.petName}
                                  className='border-b border-light-grey'
                                >
                                  <td className='py-2 px-4'>{pet.petName}</td>
                                  <td className='py-2 px-4'>{pet.timesUsed}</td>
                                  <td className='py-2 px-4'>{pet.kills}</td>
                                  <td className='py-2 px-4'>{pet.deaths}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl=''
                onPageChange={handlePageChange}
                className='mt-2.5 sm:mt-5'
              />
            )}
          </div>
        </>
      ) : (
        <div className='py-8 text-center'>
          <Paragraph className='text-muted-foreground'>
            {'Click on a tab to see the ranking of that region.'}
          </Paragraph>
        </div>
      )}
    </div>
  );
};
