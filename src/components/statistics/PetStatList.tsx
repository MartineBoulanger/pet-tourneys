import React from 'react';
import { PetStatCard } from './PetStatCard';
import { PetStatListProps } from './types';

export const PetStatList = ({ petStats }: PetStatListProps) => {
  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6 text-center'>
        {'Tournament Pet Statistics'}
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {petStats.map((petStat, index) => (
          <PetStatCard key={petStat.id} petStat={petStat} rank={index + 1} />
        ))}
      </div>
      {petStats.length === 0 && (
        <div className='text-center text-gray-500 text-xl'>
          {'No pet statistics available'}
        </div>
      )}
    </div>
  );
};
