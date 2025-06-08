'use client';

import { useState } from 'react';
import { EnhancedPlayerRecord } from '@/supabase/actions/outcome-data';
import { OverviewCard } from '@/components/statistics';
import { Heading, Paragraph, Button } from '@/components/ui';

export function TournamentOutcome({
  records,
}: {
  records: EnhancedPlayerRecord[];
}) {
  const [expandedPlayers, setExpandedPlayers] = useState<
    Record<string, boolean>
  >({});

  // Sort players by wins (descending order)
  const sortedRecords = [...records].sort((a, b) => b.wins - a.wins);

  const togglePlayer = (playerName: string) => {
    setExpandedPlayers((prev) => ({
      ...prev,
      [playerName]: !prev[playerName],
    }));
  };

  return (
    <div className='space-y-2.5 sm:space-y-5 bg-light-grey p-2.5 sm:p-5 rounded-lg shadow-md'>
      {sortedRecords.map((player) => (
        <div key={player.playerName} className='bg-background rounded-lg'>
          <Button
            onClick={() => togglePlayer(player.playerName)}
            variant='link'
            className='flex items-center justify-between w-full text-left p-2.5 sm:p-5'
          >
            <Heading as='h3' className='text-xl'>
              {player.playerName}
            </Heading>
            {expandedPlayers[player.playerName] ? '-' : '+'}
          </Button>

          {expandedPlayers[player.playerName] && (
            <div className='bg-medium-grey p-2.5 sm:p-5 rounded-b-lg p-2.5 sm:p-5'>
              <div className='flex flex-wrap flex-col md:flex-row gap-2.5 sm:gap-5 mb-2.5 sm:mb-5'>
                <OverviewCard title='Wins' value={player.wins} />
                <OverviewCard title='Losses' value={player.losses} />
                <OverviewCard title='Win Rate' value={`${player.winRate}%`} />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-5'>
                <div className='bg-background p-2.5 sm:p-5 rounded-lg'>
                  <Heading
                    as='h3'
                    className='text-xl text-muted-foreground mb-2.5'
                  >
                    Most Used Pet
                  </Heading>
                  {player.mostUsedPet.timesUsed > 0 ? (
                    <div>
                      <Paragraph className='text-md text-humanoid font-bold'>
                        {player.mostUsedPet.petName}
                      </Paragraph>
                      <Paragraph className='text-sm'>
                        Used {player.mostUsedPet.timesUsed} times
                      </Paragraph>
                      <Paragraph className='text-sm'>
                        {player.mostUsedPet.kills} kills
                      </Paragraph>
                    </div>
                  ) : (
                    <p>No pet usage data</p>
                  )}
                </div>

                <div className='bg-background p-2.5 sm:p-5 rounded-lg'>
                  <Heading
                    as='h3'
                    className='text-xl text-muted-foreground mb-2.5'
                  >
                    Most Problematic Pet
                  </Heading>
                  {player.mostProblematicPet.timesLostAgainst > 0 ? (
                    <div>
                      <Paragraph className='text-md text-humanoid font-bold'>
                        {player.mostProblematicPet.petName}
                      </Paragraph>
                      <Paragraph className='text-sm'>
                        Lost against{' '}
                        {player.mostProblematicPet.timesLostAgainst} times
                      </Paragraph>
                    </div>
                  ) : (
                    <p>No problematic pet data</p>
                  )}
                </div>
              </div>

              <div className='mt-2.5 sm:mt-5'>
                <Heading as='h3' className='text-xl mb-2.5'>
                  Player's Pets Usage & Statistics
                </Heading>
                <div className='overflow-x-auto'>
                  <table className='min-w-full'>
                    <thead className='bg-background text-left'>
                      <tr className='border-b border-medium-grey'>
                        <th className='text-left py-2 px-4'>Pet Name</th>
                        <th className='text-left py-2 px-4'>Times Used</th>
                        <th className='text-left py-2 px-4'>Kills</th>
                      </tr>
                    </thead>
                    <tbody className='bg-light-grey'>
                      {player.petStatistics.map((pet) => (
                        <tr
                          key={pet.petName}
                          className='border-b border-medium-grey'
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
    </div>
  );
}
