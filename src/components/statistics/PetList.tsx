'use client';

import { useState } from 'react';
import { PetListProps } from '@/types';

const PETS_PER_PAGE = 20;

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
      <h2 className='text-xl mb-4'>
        {matchView ? 'Match Pet Usage' : 'Tournament Pet Usage'}
      </h2>
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
                    </>
                  )}
                </tr>
              </thead>
              <tbody className='bg-medium-grey divide-y divide-light-grey'>
                {stats.slice(0, visiblePets).map((pet) => (
                  <tr key={`${pet.pet_data.name}-${pet.pet_data.type}`}>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-300'>
                      {pet.pet_data.name}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {pet.pet_data.type}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-500'>
                      {pet.breed_stats.map((bs, i) => (
                        <div key={i} className='mb-1'>
                          <span className='font-bold text-blue-300'>
                            {bs.breed}
                          </span>
                          : {bs.stats}
                        </div>
                      ))}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-blue-300 font-bold'>
                      {pet.breed_stats.map((bs, i) => (
                        <div key={i}>{bs.times_played}</div>
                      ))}
                    </td>
                    {!matchView && (
                      <>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-blue-300 font-bold'>
                          {pet.total_played}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-blue-300 font-bold'>
                          {pet.match_count}
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
                <button onClick={showMorePets} className='btn-submit'>
                  Show More (+
                  {Math.min(PETS_PER_PAGE, stats.length - visiblePets)})
                </button>
              )}
              {visiblePets > PETS_PER_PAGE && (
                <button onClick={showLessPets} className='btn-inverted'>
                  Show Less (-
                  {Math.min(PETS_PER_PAGE, stats.length - visiblePets)})
                </button>
              )}
            </div>
          </>
        ) : (
          <p className='p-4 rounded-lg text-center'>
            {'No pet usage data available yet.'}
          </p>
        )}
      </div>
    </div>
  );
}
