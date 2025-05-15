'use client';

import { Cell } from 'recharts';
import { PieGraph } from '@/components/ui/PieGraph';
import { PetBreedChartProps } from './types';
import { breedColors } from '@/utils/constants';

export const PetBreedChart = ({ breeds }: PetBreedChartProps) => {
  if (!breeds || breeds.length === 0) {
    return (
      <p className='text-center py-8'>{'No pet breed data available yet.'}</p>
    );
  }

  return (
    <PieGraph data={breeds}>
      {breeds.map((entry, index) => (
        <Cell
          key={`breed-cell-${index}`}
          fill={breedColors[entry.name as keyof typeof breedColors] || '#ccc'}
        />
      ))}
    </PieGraph>
  );
};
