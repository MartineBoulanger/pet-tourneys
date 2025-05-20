'use client';

import { Heading } from '@/components/ui';
import { PetUsageScatterChart } from '@/components/graphs';
import { PetStatsChartProps } from './types';
import { parseAndAggregateStats, convertToGraphData } from '@/utils/parsers';

export function PetStatsChart({ pets }: PetStatsChartProps) {
  const stats = parseAndAggregateStats(pets);
  const healthData = convertToGraphData(stats.health);
  const powerData = convertToGraphData(stats.power);
  const speedData = convertToGraphData(stats.speed);

  return (
    <div className='bg-light-grey rounded-lg shadow-md grid grid-cols-1 md:grid-cols-3 mb-6 lg:mb-10'>
      <div className='p-2.5 sm:p-4 sm:pr-2.5'>
        <Heading as='h2' className='mb-2.5 text-lg font-sans'>
          {'Health'}
        </Heading>
        <PetUsageScatterChart data={healthData} stat=' H' />
      </div>
      <div className='p-2.5 sm:p-4 sm:pr-2.5'>
        <Heading as='h2' className='mb-2.5 text-lg font-sans'>
          {'Power'}
        </Heading>
        <PetUsageScatterChart data={powerData} stat=' P' />
      </div>
      <div className='p-2.5 sm:p-4 sm:pr-2.5'>
        <Heading as='h2' className='mb-2.5 text-lg font-sans'>
          {'Speed'}
        </Heading>
        <PetUsageScatterChart data={speedData} stat=' S' />
      </div>
    </div>
  );
}
