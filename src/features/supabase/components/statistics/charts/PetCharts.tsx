import { BarGraph } from '@/features/recharts-graphs/BarGraph';
import { DoublePieGraph } from '@/features/recharts-graphs/DoublePieGraph';
import { petTypeColors, breedColors } from '@/features/supabase/constants';
import { Heading, Paragraph } from '@/components/ui';
import { PetChartsProps } from '../types';
import { PetStatsCharts } from './PetStatsCharts';

export const PetCharts = ({ chartData, data }: PetChartsProps) => {
  if (!chartData || !data) {
    return (
      <Paragraph className='text-center bg-background rounded-lg py-5'>
        {'No pet charts data available.'}
      </Paragraph>
    );
  }

  const playedPets = chartData.petUsageData?.slice(0, 5).map((pet) => ({
    name: pet.name,
    value: pet.total_played,
  }));

  return (
    <div className='mb-5 lg:mb-10'>
      <Heading as='h2' className='mb-2.5 text-foreground/65'>
        {'Overall Pet Usage Statistics'}
      </Heading>
      <div className='bg-light-grey rounded-lg shadow-md grid grid-cols-1 lg:grid-cols-2 gap-2.5 lg:gap-5 p-2.5 lg:p-5 mb-5 lg:mb-10'>
        <div>
          <Heading as='h3' className='text-base'>
            {'Top 5 Most Played Pets'}
          </Heading>
          {chartData.petUsageData && (
            <BarGraph
              data={playedPets}
              tooltip={'Played: '}
              color='#1e3a8a'
              color2='#f1f1f1'
            />
          )}
        </div>
        <div>
          <Heading as='h3' className='text-base'>
            {'Types And Breeds'}
          </Heading>
          {chartData.petTypeData && chartData.petBreedData && (
            <DoublePieGraph
              data={chartData.petTypeData}
              data2={chartData.petBreedData}
              fillColors={petTypeColors}
              fillColors2={breedColors}
              tooltip={'Times Used: '}
            />
          )}
        </div>
      </div>
      <div>
        <Heading as='h2' className='mb-2.5 text-foreground/65'>
          {'Overall Pet Stats Distributions'}
        </Heading>
        <PetStatsCharts data={data} />
      </div>
    </div>
  );
};
