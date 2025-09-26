'use client';

import { Heading, Paragraph } from '@/components/ui';
import { ScatterGraph } from '@/features/recharts-graphs/ScatterGraph';
import {
  parseAndAggregateStats,
  convertToGraphData,
} from '@/features/supabase/utils/statsParser';
import { COLORS } from '@/features/supabase/constants';
import { TournamentPetStat } from '@/features/supabase/types';
import { ChartsProps } from '../types';

export function PetStatsCharts({ data }: ChartsProps<TournamentPetStat>) {
  if (!data) {
    return (
      <Paragraph className='text-center bg-background rounded-lg py-5'>
        {'No pet stats data available.'}
      </Paragraph>
    );
  }

  const stats = parseAndAggregateStats(data); // get parsed pet stats data
  const healthData = convertToGraphData(stats.health, 900);
  const powerData = convertToGraphData(stats.power, 150);
  const speedData = convertToGraphData(stats.speed, 150);

  return (
    <div className='bg-light-grey rounded-lg shadow-md grid grid-cols-1 lg:grid-cols-3 gap-2.5 lg:gap-5 p-2.5 lg:p-5'>
      <div>
        <Heading as='h3' className='text-base'>
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
        <Heading as='h3' className='text-base'>
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
        <Heading as='h3' className='text-base'>
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
