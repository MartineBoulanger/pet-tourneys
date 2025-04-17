'use client';

import { LineGraph } from '@/components/ui';
import { TournamentPetStat } from '@/types';
import { parseAndAggregateStats, convertToGraphData } from '@/utils/parsers';

interface StatsOverviewProps {
  pets: TournamentPetStat[];
}

export function PetStatsChart({ pets }: StatsOverviewProps) {
  const stats = parseAndAggregateStats(pets);

  const healthData = convertToGraphData(stats.health);
  const powerData = convertToGraphData(stats.power);
  const speedData = convertToGraphData(stats.speed);

  return (
    <div className='flex flex-col gap-6 lg:gap-10'>
      <div className='bg-light-grey p-4 rounded-lg shadow-md'>
        <h2 className='mb-2.5 sm:mb-5 text-lg sm:text-xl'>
          {'Pet Health Distribution'}
        </h2>
        <LineGraph data={healthData} />
      </div>
      <div className='bg-light-grey p-4 rounded-lg shadow-md'>
        <h2 className='mb-2.5 sm:mb-5 text-lg sm:text-xl'>
          {'Pet Power Distribution'}
        </h2>
        <LineGraph data={powerData} />
      </div>
      <div className='bg-light-grey p-4 rounded-lg shadow-md'>
        <h2 className='mb-2.5 sm:mb-5 text-lg sm:text-xl'>
          {'Pet Speed Distribution'}
        </h2>
        <LineGraph data={speedData} />
      </div>
    </div>
  );
}
