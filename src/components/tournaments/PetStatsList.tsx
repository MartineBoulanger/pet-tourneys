'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { IoClose, IoCheckmark } from 'react-icons/io5';
import { Button, Heading, Paragraph, Pagination } from '@/components/ui';
import { PetStatsListProps, TypesImages } from '../statistics/types';
import { RadarGraph } from '@/components/statistics/graphs';
import { Alliance } from '@/assets/Alliance';
import { Horde } from '@/assets/Horde';
import { MedalIcon } from '@/assets/MedalIcon';
import { StrongPetIcon, WeakPetIcon } from '@/assets/PetStrengthIcons';
import { cn } from '@/utils/cn';
import { PetControls } from './PetControls';
import { usePetsFilters } from '@/hooks/usePetsFilters';

export function PetStatsList({
  petData,
  petStats,
  battleStats,
  isMatchView = false,
}: PetStatsListProps) {
  const {
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
    filters,
    handleFilterChange,
    resetFilters,
    uniqueStats,
    currentPage,
    currentPetData,
    togglePet,
    expandedPets,
    totalPages,
    handlePageChange,
    getPetStats,
    getTypeColor,
    setAvailableBreedToArray,
  } = usePetsFilters({ petData, petStats, battleStats, isMatchView });

  const topUsedPets = useMemo(() => {
    return [...petStats]
      .sort((a, b) => b.total_played - a.total_played)
      .slice(0, 10)
      .map((stat) => stat.pet_data.name);
  }, [petStats]);

  return (
    <div className='space-y-2.5 lg:space-y-5'>
      <PetControls
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortOption={sortOption}
        onSortChange={setSortOption}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={resetFilters}
        uniqueStats={uniqueStats}
        isMatchView={isMatchView}
      />

      <div className='space-y-2.5 bg-background p-2.5 rounded-lg'>
        {currentPetData.length > 0 ? (
          currentPetData.map((pet) => {
            const isTopUsed = topUsedPets.includes(pet.name);
            const usageRank = topUsedPets.indexOf(pet.name) + 1;
            const {
              stats,
              breeds,
              graphData,
              winRate,
              strength,
              totalMatches,
              totalPlayed,
            } = getPetStats(pet.name);
            const typeColor = getTypeColor(pet.type);
            const availableBreeds = setAvailableBreedToArray(
              pet.availableBreeds
            );

            if (!stats) return null;

            return (
              <div
                key={pet.petID}
                className='bg-light-grey hover:bg-medium-grey rounded-lg'
              >
                <Button
                  onClick={() => togglePet(pet.name)}
                  className='bg-transparent flex items-center justify-between w-full text-left p-0 pr-2.5 lg:pr-5'
                >
                  <div className='flex items-center'>
                    <div className='flex items-center h-[40px] w-[40px] mr-2.5'>
                      <Image
                        src={`${process.env.BASE_URL!}/images/pet-icons/${
                          pet.icon
                        }`}
                        alt={pet.name}
                        className='w-full h-full object-contain'
                        width={40}
                        height={40}
                        loading='lazy'
                      />
                    </div>
                    {isTopUsed && (
                      <div className='mr-2.5'>
                        <MedalIcon position={usageRank} className='w-5 h-5' />
                      </div>
                    )}
                    <Heading as='h3' className='mr-2.5'>
                      {pet.name}
                    </Heading>
                    {pet.isAllianceOnly === 'Yes' ? <Alliance /> : null}
                    {pet.isHordeOnly === 'Yes' ? <Horde /> : null}
                    {strength === 'strong' && (
                      <StrongPetIcon className='w-5 h-5' />
                    )}
                    {strength === 'weak' && <WeakPetIcon className='w-5 h-5' />}
                  </div>
                  {expandedPets[pet.name] ? '-' : '+'}
                </Button>

                {expandedPets[pet.name] && (
                  <div className='p-2.5 grid grid-cols-1 lg:grid-cols-3 gap-y-2.5 lg:gap-2.5 bg-light-grey rounded-b-lg'>
                    <div className='col-span-2 space-y-2.5'>
                      <div className='p-2.5 lg:p-5 rounded-lg bg-background shadow-md'>
                        <Paragraph className='italic text-center'>
                          &ldquo;{pet.description}&ldquo;
                        </Paragraph>
                      </div>

                      <div className='grid grid-cols-1 lg:grid-cols-2 gap-2.5 mt-2.5'>
                        <div className='p-2.5 lg:p-5 rounded-lg bg-background shadow-md relative'>
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
                              <span className='font-bold'>
                                {'Is tradable? '}
                              </span>
                              {pet.isTradable === 'Yes' ? (
                                <IoCheckmark
                                  color='#016630'
                                  className='w-5 h-5'
                                />
                              ) : (
                                <IoClose color='#9f0712' className='w-5 h-5' />
                              )}
                            </Paragraph>
                            <Paragraph className='font-light flex gap-2.5 mb-5'>
                              <span className='font-bold'>
                                {'Can be put in cage? '}
                              </span>
                              {pet.isCapturable === 'Yes' ? (
                                <IoCheckmark
                                  color='#016630'
                                  className='w-5 h-5'
                                />
                              ) : (
                                <IoClose color='#9f0712' className='w-5 h-5' />
                              )}
                            </Paragraph>
                            <Paragraph className='font-light'>
                              <span className='font-bold'>
                                {'Base Health: '}
                              </span>
                              {pet.baseHealth}
                            </Paragraph>
                            <Paragraph className='font-light'>
                              <span className='font-bold'>
                                {'Base Power: '}
                              </span>
                              {pet.basePower}
                            </Paragraph>
                            <Paragraph className='font-light'>
                              <span className='font-bold'>
                                {'Base Speed: '}
                              </span>
                              {pet.baseSpeed}
                            </Paragraph>
                            <div className='absolute bottom-0 right-0 opacity-10 w-[250px] h-[250px]'>
                              <Image
                                src={
                                  TypesImages[
                                    pet.type as keyof typeof TypesImages
                                  ]
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
                        <div className='p-2.5 lg:p-5 rounded-lg bg-background shadow-md'>
                          <div className='flex items-start justify-between'>
                            <Heading
                              as='h3'
                              className='text-xl font-bold'
                              style={{
                                color: typeColor,
                              }}
                            >
                              {'Battle Statistics'}
                            </Heading>
                            <div className='font-light p-2 bg-light-grey rounded-lg xl:w-[40%] space-y-1'>
                              {!isMatchView && (
                                <Paragraph className='flex items-center justify-between'>
                                  <span className='font-bold'>
                                    {'Win Rate: '}
                                  </span>
                                  <span
                                    className={cn(
                                      winRate < 25 ? 'text-red' : '',
                                      winRate >= 25 && winRate < 50
                                        ? 'text-orange'
                                        : '',
                                      winRate >= 50 && winRate < 75
                                        ? 'text-yellow'
                                        : '',
                                      winRate >= 75 ? 'text-green' : ''
                                    )}
                                  >
                                    {winRate}
                                    {'%'}
                                  </span>
                                </Paragraph>
                              )}
                              <Paragraph className='flex items-center justify-between'>
                                <span className='font-bold mr-1'>
                                  {'Total Played: '}
                                </span>
                                {totalPlayed}
                              </Paragraph>
                              {!isMatchView && (
                                <Paragraph className='flex items-center justify-between'>
                                  <span className='font-bold mr-1'>
                                    {'Total Matches: '}
                                  </span>
                                  {totalMatches}
                                </Paragraph>
                              )}
                            </div>
                          </div>
                          <RadarGraph
                            data={graphData}
                            tooltip='Count: '
                            color={typeColor}
                          />
                        </div>
                      </div>

                      <div className='p-2.5 lg:p-5 rounded-lg bg-background shadow-md'>
                        <Heading
                          as='h3'
                          className='text-xl font-bold'
                          style={{
                            color: typeColor,
                          }}
                        >
                          {'Abilities'}
                        </Heading>
                        <div className='grid grid-cols-2 gap-2.5 lg:gap-5 mt-2.5'>
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
                        src={`${process.env.BASE_URL!}/images/pets/${
                          pet.image
                        }`}
                        alt={pet.name}
                        className='w-full h-auto rounded-lg object-cover'
                        width={100}
                        height={100}
                        loading='lazy'
                      />
                      {availableBreeds.length > 0 && (
                        <div className='rounded-lg overflow-hidden bg-background shadow-md mt-2.5'>
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
                                {availableBreeds.map((breed) => {
                                  const breedStat = breeds?.find(
                                    (bs) => bs.normalizedBreed === breed
                                  );
                                  const isUsed = !!breedStat;
                                  return (
                                    <tr
                                      key={breed}
                                      className={cn(
                                        'border-b border-medium-grey last-of-type:border-none',
                                        !isUsed ? 'opacity-40' : 'opacity-100'
                                      )}
                                    >
                                      <td
                                        className='py-2 px-4 font-bold'
                                        style={{
                                          color: typeColor,
                                        }}
                                      >
                                        {breed}
                                      </td>
                                      <td className='py-2 px-4'>
                                        {isUsed ? breedStat.stats || '-' : '-'}
                                      </td>
                                      <td className='py-2 px-4'>
                                        {isUsed ? breedStat.times_played : '-'}
                                      </td>
                                    </tr>
                                  );
                                })}
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
          })
        ) : (
          <div className='text-center py-10'>
            <Heading as='h3' className='text-lg font-bold text-humanoid'>
              {'No pet matches your search criteria'}
            </Heading>
            <Paragraph className='mt-2.5'>
              {'Try adjusting your search or filters'}
            </Paragraph>
          </div>
        )}
        {totalPages > 1 ? (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl=''
            onPageChange={handlePageChange}
            className='mt-5 mb-2.5'
          />
        ) : null}
      </div>
    </div>
  );
}
