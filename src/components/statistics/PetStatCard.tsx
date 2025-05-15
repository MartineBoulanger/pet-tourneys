import React from 'react';
import { PetStatCardProps } from './types';

// Helper function to format percentage
const formatPercentage = (value: number) => {
  return value ? `${value.toFixed(1)}%` : 'N/A';
};

export const PetStatCard = ({ petStat, rank }: PetStatCardProps) => {
  // Determine primary performance metrics
  const totalPlayed = petStat.total_played || 0;
  const winRate = petStat.win_rate || 0;

  return (
    <div className='bg-green-50 rounded-lg p-4 shadow-md'>
      <div className='flex justify-between items-center mb-4'>
        <div className='flex items-center'>
          {rank && <span className='text-xl font-bold mr-2'>#{rank}</span>}
          <h2 className='text-2xl font-bold'>{petStat.pet_data.name}</h2>
        </div>
        <div className='text-right'>
          <span className='text-lg font-semibold'>{petStat.w_l}</span>
          <div className='text-sm text-gray-600'>{'Win/Loss'}</div>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4 mb-4'>
        <div>
          <h3 className='font-semibold'>{'Performance'}</h3>
          <div className='bg-green-100 rounded p-2'>
            <div className='flex justify-between'>
              <span>{'Total Matches'}</span>
              <span className='font-bold'>{totalPlayed}</span>
            </div>
            <div className='flex justify-between'>
              <span>{'Win Rate'}</span>
              <span className='font-bold'>{formatPercentage(winRate)}</span>
            </div>
            <div className='flex justify-between'>
              <span>{'Matches'}</span>
              <span className='font-bold'>{petStat.match_count || 0}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className='font-semibold'>{'Breed Breakdown'}</h3>
          <div className='bg-green-100 rounded p-2'>
            {petStat.breed_stats?.map((breed, index) => (
              <div key={index} className='flex justify-between text-sm'>
                <span>{breed.breed}</span>
                <span>
                  {breed.times_played}
                  {breed.wins !== undefined && breed.losses !== undefined
                    ? ` (${breed.wins}W/${breed.losses}L)`
                    : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {petStat.pet_data.stats && (
        <div>
          <h3 className='font-semibold mb-2'>{'Additional Details'}</h3>
          <div className='bg-green-100 rounded p-2 text-sm'>
            {typeof petStat.pet_data.stats === 'string'
              ? petStat.pet_data.stats
              : JSON.stringify(petStat.pet_data.stats)}
          </div>
        </div>
      )}
    </div>
  );
};
