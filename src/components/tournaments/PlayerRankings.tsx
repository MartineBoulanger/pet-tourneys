'use client';

import { useState } from 'react';
import Image from 'next/image';
import { OverviewCard } from '@/components/statistics';
import {
  Heading,
  Paragraph,
  Button,
  Pagination,
  Tab,
  Tabs,
} from '@/components/ui';
import { petTypeColors, PLAYERS_PER_PAGE } from '@/utils/constants';
import { EnhancedPlayerRecord } from '@/supabase/actions/players';
import { cn } from '@/utils/cn';
import { MedalIcon } from '@/assets/MedalIcon';
import { IoCheckmark, IoClose } from 'react-icons/io5';
import { Pet, TypesImages } from '../statistics/types';

export interface PlayerRankingsProps {
  records: EnhancedPlayerRecord[];
  regions: string[];
  petData: Pet[];
}

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

export const PlayerRankings = ({
  records,
  regions,
  petData,
}: PlayerRankingsProps) => {
  const [expandedPlayers, setExpandedPlayers] = useState<
    Record<string, boolean>
  >({});
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRegion, setCurrentRegion] = useState(regions[0] || '');
  const [expandedPet, setExpandedPet] = useState<string | null>(null);

  const togglePet = (petName: string) => {
    setExpandedPet(expandedPet === petName ? null : petName);
  };

  const petDetails = petData.find((pet) => pet.name === expandedPet);

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
    <div className='space-y-2.5'>
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
          <div className='space-y-2.5 bg-background p-2.5 rounded-lg shadow-md'>
            {currentRecords.map((player, index) => {
              const globalPosition =
                (currentPage - 1) * PLAYERS_PER_PAGE + index + 1;
              const mostUsedPet = petData.find(
                (pet) => pet.name === player.mostUsedPet.petName
              );
              const nemesisPet = petData.find(
                (pet) => pet.name === player.mostProblematicPet.petName
              );

              return (
                <div
                  key={player.playerName}
                  className='bg-light-grey hover:bg-medium-grey rounded-lg'
                >
                  <Button
                    onClick={() => togglePlayer(player.playerName)}
                    variant='link'
                    className='flex items-center justify-between w-full text-left p-2.5 text-foreground'
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
                    <div className='bg-light-grey p-2.5 rounded-b-lg p-2.5'>
                      <div className='flex flex-wrap flex-col lg:flex-row gap-2.5 lg:gap-5 mb-2.5 lg:mb-5'>
                        <OverviewCard title='Matches Won' value={player.wins} />
                        <OverviewCard
                          title='Matches Lost'
                          value={player.losses}
                        />
                        <OverviewCard
                          title='Win Rate'
                          value={`${player.winRate}%`}
                        />
                      </div>

                      <div className='grid grid-cols-1 lg:grid-cols-2 gap-2.5 lg:gap-5'>
                        <div className='bg-background p-2.5 lg:p-5 rounded-lg'>
                          {player.mostUsedPet.timesUsed > 0 ? (
                            <div className='flex items-start justify-between'>
                              <div>
                                <Heading
                                  as='h3'
                                  className='text-xl text-muted-foreground mb-2.5'
                                >
                                  {'Most Used Pet'}
                                </Heading>
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
                              <div className='w-[100px] lg:w-[125px] h-[100px] lg:h-[125px]'>
                                <Image
                                  src={`/images/pets/${mostUsedPet?.image}`}
                                  alt={
                                    mostUsedPet?.name ||
                                    player.mostUsedPet.petName
                                  }
                                  className='w-full h-full rounded-lg object-cover'
                                  width={90}
                                  height={90}
                                  loading='lazy'
                                />
                              </div>
                            </div>
                          ) : (
                            <Paragraph className='p-2.5 lg:p-5 rounded-lg bg-light-grey text-center shadow-md'>
                              {'No most used pet data found.'}
                            </Paragraph>
                          )}
                        </div>

                        <div className='bg-background p-2.5 lg:p-5 rounded-lg'>
                          {player.mostProblematicPet.timesLostAgainst > 0 ? (
                            <div className='flex items-start justify-between'>
                              <div>
                                <Heading
                                  as='h3'
                                  className='text-xl text-muted-foreground mb-2.5'
                                >
                                  {'Nemesis Pet'}
                                </Heading>
                                <Paragraph className='text-md text-humanoid font-bold'>
                                  {player.mostProblematicPet.petName}
                                </Paragraph>
                                <Paragraph className='text-sm'>
                                  {'Lost against '}
                                  {player.mostProblematicPet.timesLostAgainst}
                                  {' times'}
                                </Paragraph>
                              </div>
                              <div className='w-[100px] lg:w-[125px] h-[100px] lg:h-[125px]'>
                                <Image
                                  src={`/images/pets/${nemesisPet?.image}`}
                                  alt={
                                    nemesisPet?.name ||
                                    player.mostProblematicPet.petName
                                  }
                                  className='w-full h-full rounded-lg object-cover'
                                  width={90}
                                  height={90}
                                  loading='lazy'
                                />
                              </div>
                            </div>
                          ) : (
                            <Paragraph className='p-2.5 lg:p-5 rounded-lg bg-light-grey text-center shadow-md'>
                              {'No nemesis pet data found.'}
                            </Paragraph>
                          )}
                        </div>
                      </div>

                      <div className='mt-2.5 lg:mt-5'>
                        <Heading as='h4' className='text-lg font-bold mb-2.5'>
                          {"Player's Pet Usage In Tournament"}
                        </Heading>
                        <div className='overflow-x-auto rounded-lg'>
                          <table className='min-w-full'>
                            <thead className='bg-background text-left'>
                              <tr className='border-b border-medium-grey'>
                                <th className='text-left py-2 px-2.5 lg:px-5'>
                                  {'Pet Name'}
                                </th>
                                <th className='text-left py-2 px-2.5 lg:px-5'>
                                  {'Times Used'}
                                </th>
                                <th className='text-left py-2 px-2.5 lg:px-5'>
                                  {'Kills'}
                                </th>
                                <th className='text-left py-2 px-2.5 lg:px-5'>
                                  {'Deaths'}
                                </th>
                              </tr>
                            </thead>
                            <tbody className='bg-medium-grey'>
                              {player.petStatistics.map((pet) => [
                                <tr
                                  key={pet.petName + '-row'}
                                  className={cn(
                                    'border border-medium-grey border-b-light-grey cursor-pointer hover:bg-light-grey hover:border-b-medium-grey',
                                    expandedPet === pet.petName &&
                                      'bg-background border-b-background'
                                  )}
                                  onClick={() => togglePet(pet.petName)}
                                >
                                  <td className='py-2 px-2.5 lg:px-5'>
                                    {pet.petName}
                                  </td>
                                  <td className='py-2 px-2.5 lg:px-5'>
                                    {pet.timesUsed}
                                  </td>
                                  <td className='py-2 px-2.5 lg:px-5'>
                                    {pet.kills}
                                  </td>
                                  <td className='py-2 px-2.5 lg:px-5'>
                                    {pet.deaths}
                                  </td>
                                </tr>,
                                expandedPet === pet.petName && (
                                  <tr
                                    key={pet.petName + '-details'}
                                    className='border border-medium-grey'
                                  >
                                    <td colSpan={4} className='p-0'>
                                      <div className='space-y-2.5 lg:space-y-5 p-2.5 lg:p-5 bg-background relative grid grid-cols-1 lg:grid-cols-3 gap-2.5 lg:gap-5'>
                                        <div>
                                          <div className='w-full lg:w-[300px] h-auto lg:h-[300px]'>
                                            <Image
                                              src={`/images/pets/${petDetails?.image}`}
                                              alt={
                                                petDetails?.name || pet.petName
                                              }
                                              className='w-full h-full rounded-lg object-cover'
                                              width={100}
                                              height={100}
                                              loading='lazy'
                                            />
                                          </div>
                                        </div>
                                        <div>
                                          <Heading
                                            as='h3'
                                            className='text-xl font-bold'
                                            style={{
                                              color:
                                                petTypeColors[
                                                  petDetails?.type as keyof typeof petTypeColors
                                                ],
                                            }}
                                          >
                                            {'Basic Information'}
                                          </Heading>
                                          <div className='space-y-1 mt-2'>
                                            <Paragraph className='font-light'>
                                              <span className='font-bold'>
                                                {'Pet ID: '}
                                              </span>
                                              {petDetails?.petID}
                                            </Paragraph>
                                            <Paragraph className='font-light'>
                                              <span className='font-bold'>
                                                {'Type: '}
                                              </span>
                                              {petDetails?.type}
                                            </Paragraph>
                                            <Paragraph className='font-light'>
                                              <span className='font-bold'>
                                                {'Source: '}
                                              </span>
                                              {petDetails?.source}
                                            </Paragraph>
                                            <Paragraph className='font-light mb-5'>
                                              <span className='font-bold'>
                                                {'Expansion: '}
                                              </span>
                                              {petDetails?.expansion}
                                            </Paragraph>
                                            <Paragraph className='font-light flex gap-2.5'>
                                              <span className='font-bold'>
                                                {'Is tradable? '}
                                              </span>
                                              {petDetails?.isTradable ===
                                              'Yes' ? (
                                                <IoCheckmark
                                                  color='#016630'
                                                  className='w-5 h-5'
                                                />
                                              ) : (
                                                <IoClose
                                                  color='#9f0712'
                                                  className='w-5 h-5'
                                                />
                                              )}
                                            </Paragraph>
                                            <Paragraph className='font-light flex gap-2.5 mb-5'>
                                              <span className='font-bold'>
                                                {'Can be put in cage? '}
                                              </span>
                                              {petDetails?.isCapturable ===
                                              'Yes' ? (
                                                <IoCheckmark
                                                  color='#016630'
                                                  className='w-5 h-5'
                                                />
                                              ) : (
                                                <IoClose
                                                  color='#9f0712'
                                                  className='w-5 h-5'
                                                />
                                              )}
                                            </Paragraph>
                                            <Paragraph className='font-light'>
                                              <span className='font-bold'>
                                                {'Base Health: '}
                                              </span>
                                              {petDetails?.baseHealth}
                                            </Paragraph>
                                            <Paragraph className='font-light'>
                                              <span className='font-bold'>
                                                {'Base Power: '}
                                              </span>
                                              {petDetails?.basePower}
                                            </Paragraph>
                                            <Paragraph className='font-light'>
                                              <span className='font-bold'>
                                                {'Base Speed: '}
                                              </span>
                                              {petDetails?.baseSpeed}
                                            </Paragraph>
                                            <div className='absolute bottom-0 right-0 opacity-10 w-[150px] lg:w-[250px] h-[150px] lg:h-[250px]'>
                                              <Image
                                                src={
                                                  TypesImages[
                                                    petDetails?.type as keyof typeof TypesImages
                                                  ]
                                                }
                                                alt={`${petDetails?.type} Icon`}
                                                width={250}
                                                height={250}
                                                className='w-full h-full object-cover'
                                                loading='lazy'
                                              />
                                            </div>
                                          </div>
                                        </div>
                                        <div>
                                          <div>
                                            <Heading
                                              as='h3'
                                              className='text-xl font-bold'
                                              style={{
                                                color:
                                                  petTypeColors[
                                                    petDetails?.type as keyof typeof petTypeColors
                                                  ],
                                              }}
                                            >
                                              {'Possible Breeds'}
                                            </Heading>
                                            <div className='flex flex-wrap gap-2.5 mt-2.5'>
                                              {petDetails?.availableBreeds
                                                .split(',')
                                                .map((b) => (
                                                  <Paragraph
                                                    key={b}
                                                    className='p-2 rounded-lg border border-light-grey'
                                                  >
                                                    {b}
                                                  </Paragraph>
                                                ))}
                                            </div>
                                          </div>
                                          <Heading
                                            as='h3'
                                            className='text-xl font-bold mt-2.5 lg:mt-5'
                                            style={{
                                              color:
                                                petTypeColors[
                                                  petDetails?.type as keyof typeof petTypeColors
                                                ],
                                            }}
                                          >
                                            {'Abilities'}
                                          </Heading>
                                          <div className='space-y-1 mt-2.5'>
                                            <Paragraph className='font-light'>
                                              <span className='font-bold'>
                                                {'Lvl 1: '}
                                              </span>
                                              {petDetails?.ability1}
                                            </Paragraph>
                                            <Paragraph className='font-light'>
                                              <span className='font-bold'>
                                                {'Lvl 2: '}
                                              </span>
                                              {petDetails?.ability2}
                                            </Paragraph>
                                            <Paragraph className='font-light'>
                                              <span className='font-bold'>
                                                {'Lvl 4: '}
                                              </span>
                                              {petDetails?.ability3}
                                            </Paragraph>
                                            <Paragraph className='font-light'>
                                              <span className='font-bold'>
                                                {'Lvl 10: '}
                                              </span>
                                              {petDetails?.ability4}
                                            </Paragraph>
                                            <Paragraph className='font-light'>
                                              <span className='font-bold'>
                                                {'Lvl 15: '}
                                              </span>
                                              {petDetails?.ability5}
                                            </Paragraph>
                                            <Paragraph className='font-light'>
                                              <span className='font-bold'>
                                                {'Lvl 20: '}
                                              </span>
                                              {petDetails?.ability6}
                                            </Paragraph>
                                          </div>
                                        </div>
                                      </div>
                                      <div className='p-2.5 lg:p-5 bg-background'>
                                        <div
                                          style={{
                                            color:
                                              petTypeColors[
                                                petDetails?.type as keyof typeof petTypeColors
                                              ],
                                          }}
                                        >
                                          <Paragraph className='italic text-center'>
                                            &ldquo;{petDetails?.description}
                                            &ldquo;
                                          </Paragraph>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                ),
                              ])}
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
                className='mb-2.5 mt-5 lg:mt-5'
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
