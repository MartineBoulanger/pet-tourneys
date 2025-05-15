'use client';

import { LineGraph, Heading } from '@/components/ui';
import { PetStatsChartProps } from './types';
import { parseAndAggregateStats, convertToGraphData } from '@/utils/parsers';

export function PetStatsChart({ pets }: PetStatsChartProps) {
  const stats = parseAndAggregateStats(pets);
  const healthData = convertToGraphData(stats.health);
  const powerData = convertToGraphData(stats.power);
  const speedData = convertToGraphData(stats.speed);

  return (
    <div className='flex flex-col gap-6 lg:gap-10'>
      <div className='bg-light-grey p-4 rounded-lg shadow-md'>
        <Heading as='h2' className='mb-2.5 sm:mb-5 text-lg sm:text-xl'>
          {'Pet Health Distribution'}
        </Heading>
        <LineGraph data={healthData} />
      </div>
      <div className='bg-light-grey p-4 rounded-lg shadow-md'>
        <Heading as='h2' className='mb-2.5 sm:mb-5 text-lg sm:text-xl'>
          {'Pet Power Distribution'}
        </Heading>
        <LineGraph data={powerData} />
      </div>
      <div className='bg-light-grey p-4 rounded-lg shadow-md'>
        <Heading as='h2' className='mb-2.5 sm:mb-5 text-lg sm:text-xl'>
          {'Pet Speed Distribution'}
        </Heading>
        <LineGraph data={speedData} />
      </div>
    </div>
  );
}
