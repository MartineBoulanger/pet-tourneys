'use client';

import { Heading } from '@/components/ui';
import { ChartsProps } from '../types';
import { ScatterGraph } from '../graphs';
import { parseAndAggregateStats, convertToGraphData } from '@/utils/parsers';
import { COLORS } from '@/utils/constants';
import { TournamentPetStat } from '@/utils/types';

export function PetStatsCharts({ data }: ChartsProps<TournamentPetStat>) {
  if (!data) {
    return (
      <p className='text-center bg-background rounded-lg py-5'>
        {'No pet stats data available.'}
      </p>
    );
  }

  const stats = parseAndAggregateStats(data); // get parsed pet stats data
  const healthData = convertToGraphData(stats.health, 900);
  const powerData = convertToGraphData(stats.power, 150);
  const speedData = convertToGraphData(stats.speed, 150);

  return (
    <div className='bg-light-grey rounded-lg shadow-md grid grid-cols-1 md:grid-cols-3 gap-2.5 lg:gap-5 p-2.5 lg:p-5'>
      <div>
        <Heading as='h2' className='mb-2.5 text-base lg:text-lg font-sans'>
          {'Health'}
        </Heading>
        <ScatterGraph
          data={healthData}
          colors={COLORS}
          tooltip={'Times Used: '}
          tooltipNamePrefix={'Health - '}
        />
      </div>
      <div>
        <Heading as='h2' className='mb-2.5 text-base lg:text-lg font-sans'>
          {'Power'}
        </Heading>
        <ScatterGraph
          data={powerData}
          colors={COLORS}
          tooltip={'Times Used: '}
          tooltipNamePrefix={'Power - '}
        />
      </div>
      <div>
        <Heading as='h2' className='mb-2.5 text-base lg:text-lg font-sans'>
          {'Speed'}
        </Heading>
        <ScatterGraph
          data={speedData}
          colors={COLORS}
          tooltip={'Times Used: '}
          tooltipNamePrefix={'Speed - '}
        />
      </div>
    </div>
  );
}
