'use client';

import { useState } from 'react';
import { EnhancedPlayerRecord } from '@/supabase/actions/players';
import { OverviewCard } from '@/components/statistics';
import { Heading, Paragraph, Button, Pagination } from '@/components/ui';
import { PLAYERS_PER_PAGE } from '@/utils/constants';

export function TournamentPlayersList({
  records,
}: {
  records: EnhancedPlayerRecord[];
}) {
  const [expandedPlayers, setExpandedPlayers] = useState<
    Record<string, boolean>
  >({});
  const [currentPage, setCurrentPage] = useState(1);

  // Sort players by wins (descending order)
  const sortedRecords = [...records].sort((a, b) => b.wins - a.wins);

  // Calculate pagination
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
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className='space-y-2.5 sm:space-y-5 bg-background p-2.5 sm:p-5 rounded-lg shadow-md'>
      {currentRecords.map((player) => (
        <div
          key={player.playerName}
          className='bg-light-grey hover:bg-medium-grey rounded-lg'
        >
          <Button
            onClick={() => togglePlayer(player.playerName)}
            variant='link'
            className='flex items-center justify-between w-full text-left p-2.5 sm:p-5 text-foreground'
          >
            <Heading as='h3' className='text-xl'>
              {player.playerName}
            </Heading>
            {expandedPlayers[player.playerName] ? '-' : '+'}
          </Button>

          {expandedPlayers[player.playerName] && (
            <div className='bg-light-grey p-2.5 sm:p-5 rounded-b-lg p-2.5 sm:p-5'>
              <div className='flex flex-wrap flex-col md:flex-row gap-2.5 sm:gap-5 mb-2.5 sm:mb-5'>
                <OverviewCard title='Matches Won' value={player.wins} />
                <OverviewCard title='Matches Lost' value={player.losses} />
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
                        <th className='text-left py-2 px-4'>{'Pet Name'}</th>
                        <th className='text-left py-2 px-4'>{'Times Used'}</th>
                        <th className='text-left py-2 px-4'>{'Kills'}</th>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
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
  );
}
