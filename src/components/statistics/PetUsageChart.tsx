'use client';

import { BarGraph } from '@/components/ui';
import { PetUsageChartProps } from './types';

export const PetUsageChart = ({ pets }: PetUsageChartProps) => {
  if (!pets || pets.length === 0) {
    return (
      <p className='text-center py-8'>{'No pet usage data available yet.'}</p>
    );
  }

  const chartData = pets.map((pet) => ({
    name: pet.name,
    value: pet.total_played,
    stats: pet.stats,
    type: pet.type,
  }));

  return (
    <BarGraph
      data={chartData}
      tooltipTextColor='#111111'
      tooltipHoverColor='#f3f4f6'
    />
  );
};
