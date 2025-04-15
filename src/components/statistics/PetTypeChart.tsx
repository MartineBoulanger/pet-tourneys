'use client';

import { Cell } from 'recharts';
import { PieGraph } from '@/components/ui/PieGraph';

const petTypeColors = {
  Beast: '#d52824',
  Dragonkin: '#2d9318',
  Elemental: '#f9b307',
  Undead: '#92646c',
  Mechanical: '#99988f',
  Humanoid: '#11a7f6',
  Magic: '#a56dfd',
  Aquatic: '#10abb2',
  Flying: '#dfcf5b',
  Critter: '#775845',
};

export const PetTypeChart = ({
  types,
}: {
  types: { name: string; value: number }[] | undefined;
}) => {
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
