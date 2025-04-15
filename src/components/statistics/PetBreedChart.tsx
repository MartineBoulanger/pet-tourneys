'use client';

import { Cell } from 'recharts';
import { PieGraph } from '@/components/ui/PieGraph';

// Define color palette for breeds (extend as needed)
const breedColors = {
  'S/S': '#FF6B6B',
  'P/P': '#4ECDC4',
  'H/H': '#45B7D1',
  'B/B': '#FFA07A',
  'P/S': '#98D8C8',
  'S/B': '#F06292',
  'P/B': '#81C784',
  'H/S': '#64B5F6',
  'H/P': '#BA68C8',
  'H/B': '#FFD54F',
};

export const PetBreedChart = ({
  breeds,
}: {
  breeds: { name: string; value: number }[] | undefined;
}) => {
  if (!breeds || breeds.length === 0) {
    return (
      <p className='text-center py-8'>
        {'No pet breed data available yet.'}
      </p>
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
