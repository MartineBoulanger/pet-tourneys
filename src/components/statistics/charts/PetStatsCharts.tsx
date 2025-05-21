'use client';

import { Heading } from '@/components/ui';
import { PetStatsChartProps } from '../types';
import { ScatterGraph } from '../graphs';
import { parseAndAggregateStats, convertToGraphData } from '@/utils/parsers';
import { COLORS } from '@/utils/constants';

export function PetStatsCharts({ pets }: PetStatsChartProps) {
  const stats = parseAndAggregateStats(pets);
  const healthData = convertToGraphData(stats.health);
  const powerData = convertToGraphData(stats.power);
  const speedData = convertToGraphData(stats.speed);

  return (
    <div className='bg-light-grey rounded-lg shadow-md grid grid-cols-1 md:grid-cols-3 gap-5 p-2.5 sm:p-5'>
      <div>
        <Heading as='h2' className='mb-2.5 text-lg font-sans'>
          {'Health'}
        </Heading>
        <ScatterGraph
          data={healthData}
          fillColors={COLORS}
          tooltip='Times Used: '
          tooltipNamePrefix='Health - '
        />
      </div>
      <div>
        <Heading as='h2' className='mb-2.5 text-lg font-sans'>
          {'Power'}
        </Heading>
        <ScatterGraph
          data={powerData}
          fillColors={COLORS}
          tooltip='Times Used: '
          tooltipNamePrefix='Power - '
        />
      </div>
      <div>
        <Heading as='h2' className='mb-2.5 text-lg font-sans'>
          {'Speed'}
        </Heading>
        <ScatterGraph
          data={speedData}
          fillColors={COLORS}
          tooltip='Times Used: '
          tooltipNamePrefix='Speed - '
        />
      </div>
    </div>
  );
}
