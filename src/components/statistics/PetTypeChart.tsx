'use client';

import { Cell } from 'recharts';
import { PieGraph } from '@/components/ui/PieGraph';
import { PetTypeChartProps } from '@/types';
import { petTypeColors } from '@/types/constants';

export const PetTypeChart = ({ types }: PetTypeChartProps) => {
  if (!types || types.length === 0) {
    return (
      <p className='text-center py-8'>{'No pet type data available yet.'}</p>
    );
  }

  return (
    <PieGraph data={types}>
      {types.map((entry, index) => (
        <Cell
          key={`cell-${index}`}
          fill={
            petTypeColors[entry.name as keyof typeof petTypeColors] || '#ccc'
          }
        />
      ))}
    </PieGraph>
  );
};
