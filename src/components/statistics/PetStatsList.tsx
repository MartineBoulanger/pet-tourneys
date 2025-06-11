'use client';

import { useState } from 'react';
import Image from 'next/image';
import { IoClose, IoCheckmark } from 'react-icons/io5';
import { Button, Heading, Paragraph, Pagination } from '@/components/ui';
import { TournamentPetStat } from '@/utils/types';
import { PetStatsListProps, TypesImages } from './types';
import { petTypeColors, PETS_PER_PAGE } from '@/utils/constants';
import { RadarGraph } from '@/components/statistics/graphs';
import { Alliance } from '@/assets/Alliance';
import { Horde } from '@/assets/Horde';

export function PetStatsList({
  petData,
  petStats,
  battleStats,
}: PetStatsListProps) {
  const [expandedPets, setExpandedPets] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);

  // Create a map of pet stats by name for easy lookup
  const petStatsMap = new Map<string, TournamentPetStat>();
  petStats.forEach((stat) => {
    petStatsMap.set(stat.pet_data.name, stat);
  });

  const petPerformance = battleStats?.petPerformance || {};
  const petSwapDetails = battleStats?.petSwapDetails || {};

  // Calculate pagination
  const totalPages = Math.ceil(petData.length / PETS_PER_PAGE);
  const currentPetData = petData.slice(
    (currentPage - 1) * PETS_PER_PAGE,
    currentPage * PETS_PER_PAGE
  );

  const togglePet = (petName: string) => {
    setExpandedPets((prev) => ({
      ...prev,
      [petName]: !prev[petName],
    }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className='space-y-2.5 sm:space-y-5 bg-background p-2.5 sm:p-5 rounded-lg'>
      {currentPetData.map((pet) => {
        const stats = petStatsMap.get(pet.name);
        if (!stats) return null;

        const performance = petPerformance[pet.name] || {
          kills: 0,
          deaths: 0,
        };
        const swaps = petSwapDetails[pet.name] || 0;
        const typeColor = petTypeColors[pet.type as keyof typeof petTypeColors];

        const graphData = [
          {
            name: 'Total Played',
            value: stats.total_played || 0,
          },
          {
            name: 'Wins',
            value: stats.wins || 0,
          },
          {
            name: 'Losses',
            value: stats.losses || 0,
          },
          {
            name: 'Matches',
            value: stats.match_count || 0,
          },
          {
            name: 'Kills',
            value: performance.kills || 0,
          },
          {
            name: 'Deaths',
            value: performance.deaths || 0,
          },
          {
            name: 'Swaps',
            value: swaps || 0,
          },
        ];

        return (
          <div
            key={pet.petID}
            className='bg-light-grey hover:bg-medium-grey rounded-lg'
          >
            <Button
              onClick={() => togglePet(pet.name)}
              className='bg-transparent flex items-center justify-between w-full text-left p-0 pr-2.5 sm:pr-5'
            >
              <div className='flex items-center'>
                <div className='flex items-center h-[50px] w-[50px] mr-5'>
                  <Image
                    src={`${process.env
                      .NEXT_PUBLIC_BASE_URL!}/images/pet-icons/${pet.icon}`}
                    alt={pet.name}
                    className='w-full h-full object-contain'
                    width={50}
                    height={50}
                    loading='lazy'
                  />
                </div>
                <Heading as='h3' className='mr-2.5'>
                  {pet.name}
                </Heading>
                {pet.isAllianceOnly === 'Yes' ? <Alliance /> : null}
                {pet.isHordeOnly === 'Yes' ? <Horde /> : null}
              </div>
              {expandedPets[pet.name] ? '-' : '+'}
            </Button>

            {expandedPets[pet.name] && (
              <div className='p-2.5 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-y-2.5 sm:gap-5 bg-light-grey rounded-b-lg'>
                <div className='col-span-2 space-y-2.5 sm:space-y-5'>
                  <div className='p-2.5 sm:p-5 rounded-lg bg-background shadow-md'>
                    <Paragraph className='italic text-center'>
                      &ldquo;{pet.description}&ldquo;
                    </Paragraph>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-5 mt-2.5'>
                    <div className='p-2.5 sm:p-5 rounded-lg bg-background shadow-md relative'>
                      <Heading
                        as='h3'
                        className='text-xl font-bold'
                        style={{
                          color: typeColor,
                        }}
                      >
                        {'Basic Information'}
                      </Heading>
                      <div className='space-y-1 mt-2'>
                        <Paragraph className='font-light'>
                          <span className='font-bold'>{'Pet ID: '}</span>
                          {pet.petID}
                        </Paragraph>
                        <Paragraph className='font-light'>
                          <span className='font-bold'>{'Type: '}</span>
                          {pet.type}
                        </Paragraph>
                        <Paragraph className='font-light'>
                          <span className='font-bold'>{'Source: '}</span>
                          {pet.source}
                        </Paragraph>
                        <Paragraph className='font-light mb-5'>
                          <span className='font-bold'>{'Expansion: '}</span>
                          {pet.expansion}
                        </Paragraph>
                        <Paragraph className='font-light flex gap-2.5'>
                          <span className='font-bold'>{'Is tradable? '}</span>
                          {pet.isTradable === 'Yes' ? (
                            <IoCheckmark color='#016630' className='w-5 h-5' />
                          ) : (
                            <IoClose color='#9f0712' className='w-5 h-5' />
                          )}
                        </Paragraph>
                        <Paragraph className='font-light flex gap-2.5 mb-5'>
                          <span className='font-bold'>
                            {'Can be put in cage? '}
                          </span>
                          {pet.isCapturable === 'Yes' ? (
                            <IoCheckmark color='#016630' className='w-5 h-5' />
                          ) : (
                            <IoClose color='#9f0712' className='w-5 h-5' />
                          )}
                        </Paragraph>
                        <Paragraph className='font-light'>
                          <span className='font-bold'>{'Base Health: '}</span>
                          {pet.baseHealth}
                        </Paragraph>
                        <Paragraph className='font-light'>
                          <span className='font-bold'>{'Base Power: '}</span>
                          {pet.basePower}
                        </Paragraph>
                        <Paragraph className='font-light'>
                          <span className='font-bold'>{'Base Speed: '}</span>
                          {pet.baseSpeed}
                        </Paragraph>
                        <div className='absolute bottom-0 right-0 opacity-10 w-[250px] h-[250px]'>
                          <Image
                            src={
                              TypesImages[pet.type as keyof typeof TypesImages]
                            }
                            alt={`${pet.type} Icon`}
                            width={250}
                            height={250}
                            className='w-full h-full object-cover'
                            loading='lazy'
                          />
                        </div>
                      </div>
                    </div>
                    <div className='p-2.5 sm:p-5 rounded-lg bg-background shadow-md'>
                      <Heading
                        as='h3'
                        className='text-xl font-bold'
                        style={{
                          color: typeColor,
                        }}
                      >
                        {'Battle Statistics'}
                      </Heading>
                      <RadarGraph
                        data={graphData}
                        tooltip='Count: '
                        color={typeColor}
                      />
                    </div>
                  </div>

                  <div className='p-2.5 sm:p-5 rounded-lg bg-background shadow-md'>
                    <Heading
                      as='h3'
                      className='text-xl font-bold'
                      style={{
                        color: typeColor,
                      }}
                    >
                      {'Abilities'}
                    </Heading>
                    <div className='grid grid-cols-2 gap-2.5 sm:gap-5 mt-2.5'>
                      <div className='space-y-1'>
                        <Paragraph className='font-light'>
                          <span className='font-bold'>{'Lvl 1: '}</span>
                          {pet.ability1}
                        </Paragraph>
                        <Paragraph className='font-light'>
                          <span className='font-bold'>{'Lvl 2: '}</span>
                          {pet.ability2}
                        </Paragraph>
                        <Paragraph className='font-light'>
                          <span className='font-bold'>{'Lvl 4: '}</span>
                          {pet.ability3}
                        </Paragraph>
                      </div>
                      <div className='space-y-1'>
                        <Paragraph className='font-light'>
                          <span className='font-bold'>{'Lvl 10: '}</span>
                          {pet.ability4}
                        </Paragraph>
                        <Paragraph className='font-light'>
                          <span className='font-bold'>{'Lvl 15: '}</span>
                          {pet.ability5}
                        </Paragraph>
                        <Paragraph className='font-light'>
                          <span className='font-bold'>{'Lvl 20: '}</span>
                          {pet.ability6}
                        </Paragraph>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_URL!}/images/pets/${
                      pet.image
                    }`}
                    alt={pet.name}
                    className='w-full h-auto rounded-lg object-cover'
                    width={100}
                    height={100}
                    loading='lazy'
                  />
                  {stats.breed_stats.length > 0 && (
                    <div className='rounded-lg overflow-hidden bg-background shadow-md mt-2.5 sm:mt-5'>
                      <div className='overflow-x-auto'>
                        <table className='min-w-full'>
                          <thead
                            className='text-left text-background'
                            style={{
                              backgroundColor: typeColor,
                            }}
                          >
                            <tr>
                              <th className='py-2 px-4'>{'Breed'}</th>
                              <th className='py-2 px-4'>{'Stats'}</th>
                              <th className='py-2 px-4'>{'Times Used'}</th>
                            </tr>
                          </thead>
                          <tbody className='bg-background font-light'>
                            {stats.breed_stats.map((breed, index) => (
                              <tr
                                key={index}
                                className='border-b border-medium-grey last-of-type:border-none'
                              >
                                <td
                                  className='py-2 px-4 font-bold'
                                  style={{
                                    color: typeColor,
                                  }}
                                >
                                  {breed.breed}
                                </td>
                                <td className='py-2 px-4'>
                                  {breed.stats || '-'}
                                </td>
                                <td className='py-2 px-4'>
                                  {breed.times_played}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
      {totalPages > 1 ? (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl=''
          onPageChange={handlePageChange}
          className='mt-2.5 sm:mt-5'
        />
      ) : null}
    </div>
  );
}
