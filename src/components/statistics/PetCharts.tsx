import { PetChartsProps } from './types';
import { PetStatsChart } from './PetStatsChart';
import { PetUsageBarChart, PetUsagePieChart } from '@/components/graphs';
import { Heading } from '@/components/ui';

export const PetCharts = ({ chartData, stats }: PetChartsProps) => {
  return (
    <div className='mb-6 lg:mb-10'>
      <Heading as='h2' className='text-xl sm:text-3xl'>
        {'Overall Pet Usage Statistics'}
      </Heading>
      <div className='bg-light-grey rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 mb-6 lg:mb-10'>
        <div className='p-2.5 sm:p-4 sm:pr-2.5'>
          <Heading as='h2' className='mb-2.5 text-lg font-sans'>
            {'Top Played Pets'}
          </Heading>
          {chartData.petUsageData && (
            <PetUsageBarChart
              pets={chartData.petUsageData}
              defaultColor='#1e3a8a'
            />
          )}
        </div>
        <div className='p-2.5 sm:p-4 sm:pl-2.5'>
          <Heading as='h2' className='mb-2.5 text-lg font-sans'>
            {'Types And Breeds'}
          </Heading>
          {chartData.petTypeData && chartData.petBreedData && (
            <PetUsagePieChart
              types={chartData.petTypeData}
              breeds={chartData.petBreedData}
            />
          )}
        </div>
      </div>
      <div>
        <Heading as='h2' className='text-xl sm:text-3xl'>
          {'Pet Stats Distributions'}
        </Heading>
        <PetStatsChart pets={stats} />
      </div>
    </div>
  );
};
