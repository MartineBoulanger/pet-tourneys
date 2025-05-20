import { BattleChartsProps } from './types';
import {
  RegionMatchesPieChart,
  BattleResultsPieChart,
} from '@/components/graphs';
import { Heading } from '@/components/ui';

export const BattleCharts = ({
  matchesStats,
  abilityStats,
  battleStats,
}: BattleChartsProps) => {
  const regions =
    matchesStats?.matchesByRegion &&
    matchesStats.matchesByRegion.filter((r) => r.value !== 0);

  const battleResults =
    matchesStats?.battleResults &&
    matchesStats.battleResults.filter((b) => b.value !== 0);

  return (
    <div className='mb-6 lg:mb-10'>
      <Heading as='h2' className='text-xl sm:text-3xl'>
        {'Overall Matches Statistics'}
      </Heading>
      <div className='bg-light-grey rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 mb-6 lg:mb-10'>
        <div className='p-2.5 sm:p-4 sm:pl-2.5'>
          <Heading as='h2' className='mb-2.5 text-lg font-sans'>
            {'Matches Per Region'}
          </Heading>
          {matchesStats && matchesStats.matchesByRegion && (
            <RegionMatchesPieChart regions={regions} />
          )}
        </div>
        <div className='p-2.5 sm:p-4 sm:pl-2.5'>
          <Heading as='h2' className='mb-2.5 text-lg font-sans'>
            {'Battle Results'}
          </Heading>
          {matchesStats && matchesStats.matchesByRegion && (
            <BattleResultsPieChart results={battleResults} />
          )}
        </div>
      </div>
    </div>
  );
};
