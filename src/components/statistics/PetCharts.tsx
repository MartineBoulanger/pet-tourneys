import { PetChartsProps } from '@/types';
import { PetBreedChart } from './PetBreedChart';
import { PetStatsChart } from './PetStatsChart';
import { PetTypeChart } from './PetTypeChart';
import { PetUsageChart } from './PetUsageChart';
import { Heading } from '@/components/ui';

export const PetCharts = ({ chartData, stats }: PetChartsProps) => {
  return (
    <div className='mb-6 lg:mb-10'>
      <div className='bg-light-grey p-2.5 sm:p-4 rounded-lg shadow-md'>
        <Heading as='h2' className='mb-2.5 sm:mb-5 text-lg sm:text-xl'>
          {'Top 10 Most Used Pets'}
        </Heading>
        {chartData.petUsageData && (
          <PetUsageChart pets={chartData.petUsageData} />
        )}
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 my-6 lg:my-10'>
        <div className='bg-light-grey p-2.5 sm:p-4 rounded-lg shadow-md'>
          <Heading as='h2' className='mb-2.5 sm:mb-5 text-lg sm:text-xl'>
            {'Pet Types'}
          </Heading>
          {chartData.petTypeData && (
            <PetTypeChart types={chartData.petTypeData} />
          )}
        </div>
        <div className='bg-light-grey p-2.5 sm:p-4 rounded-lg shadow-md'>
          <Heading as='h2' className='mb-2.5 sm:mb-5 text-lg sm:text-xl'>
            {'Pet Breeds'}
          </Heading>
          {chartData.petBreedData && (
            <PetBreedChart breeds={chartData.petBreedData} />
          )}
        </div>
      </div>
      <div className='mb-6 lg:mb-10'>
        <PetStatsChart pets={stats} />
      </div>
    </div>
  );
};
