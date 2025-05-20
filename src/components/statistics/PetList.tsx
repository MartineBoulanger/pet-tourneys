'use client';

import { useState } from 'react';
import { PetListProps } from './types';
import { PETS_PER_PAGE } from '@/utils/constants';
import { Heading, Button, Paragraph } from '@/components/ui';

export function PetList({ stats, matchView = false }: PetListProps) {
  const [visiblePets, setVisiblePets] = useState(PETS_PER_PAGE);

  const showMorePets = () => {
    setVisiblePets((prev) => Math.min(prev + PETS_PER_PAGE, stats.length));
  };

  const showLessPets = () => {
    setVisiblePets((prev) => Math.max(PETS_PER_PAGE, prev - PETS_PER_PAGE));
  };

  return (
    <div className='bg-light-grey shadow-md rounded-lg p-4'>
      <Heading as='h2' className='mb-2.5 text-lg font-sans'>
        {matchView ? 'Match Pet Usage' : 'Tournament Pet Usage'}
      </Heading>
      <div className='overflow-x-auto'>
        {stats && stats.length > 0 ? (
          <>
            <table className='min-w-full divide-y divide-dark-grey'>
              <thead className='bg-dark-grey'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider'>
                    Pet Name
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider'>
                    Type
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider'>
                    Breed/Stats
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider'>
                    Times Played
                  </th>
                  {!matchView && (
                    <>
                      <th className='px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider'>
                        Total Played
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider'>
                        Matches
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider'>
                        Win Rate
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider'>
                        Win/Loss
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className='bg-medium-grey divide-y divide-light-grey'>
                {stats.slice(0, visiblePets).map((pet) => (
                  <tr key={`${pet.pet_data.name}-${pet.pet_data.type}`}>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-bold text-light-blue'>
                      {pet.pet_data.name}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm'>
                      {pet.pet_data.type}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-500'>
                      {pet.breed_stats.map((bs, i) => (
                        <div key={i} className='mb-1 text-foreground'>
                          <span className='font-bold text-light-blue'>
                            {bs.breed}
                          </span>
                          : {bs.stats}
                        </div>
                      ))}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-light-blue font-bold'>
                      {pet.breed_stats.map((bs, i) => (
                        <div key={i}>{bs.times_played}</div>
                      ))}
                    </td>
                    {!matchView && (
                      <>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-light-blue font-bold'>
                          {pet.total_played}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-foreground font-bold'>
                          {pet.match_count}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-light-blue font-bold'>
                          {pet.win_rate}%
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-foreground font-bold'>
                          {pet.w_l}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Show More/Less Buttons */}
            <div className='flex justify-center gap-4 mt-4'>
              {visiblePets < stats.length && (
                <Button
                  onClick={showMorePets}
                  title='Show More'
                  aria-label='Show More'
                >
                  Show More
                </Button>
              )}
              {visiblePets > PETS_PER_PAGE && (
                <Button
                  onClick={showLessPets}
                  className='btn-inverted'
                  title='Show Less'
                  aria-label='Show Less'
                >
                  Show Less
                </Button>
              )}
            </div>
          </>
        ) : (
          <Paragraph className='p-4 rounded-lg text-center'>
            {'No pet usage data available yet.'}
          </Paragraph>
        )}
      </div>
    </div>
  );
}
