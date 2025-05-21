import { BattleChartsProps } from '../types';
import { PieGraph } from '../graphs';
import { OverviewCard } from '../OverviewCard';
import { Heading } from '@/components/ui';
import { regionsColors, resultsColors } from '@/utils/constants';

export const BattleCharts = ({ matchesStats }: BattleChartsProps) => {
  return (
    <div className='mb-5 lg:mb-10'>
      <Heading as='h2' className='text-xl sm:text-3xl mb-2.5'>
        {'Overall Matches Statistics'}
      </Heading>
      <div className='flex flex-wrap flex-col md:flex-row gap-5 mb-5'>
        {matchesStats?.totalMatches && (
          <OverviewCard
            title='Total Matches'
            value={matchesStats.totalMatches || 0}
          />
        )}
        {matchesStats?.totalBattles && (
          <OverviewCard
            title='Total Battles'
            value={matchesStats.totalBattles}
          />
        )}
        {matchesStats?.averageDuration && (
          <OverviewCard
            title='Average Battle Duration'
            value={matchesStats.averageDuration}
          />
        )}
      </div>
      <div className='bg-light-grey rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-5 p-2.5 sm:p-5'>
        <div>
          <Heading as='h2' className='mb-2.5 text-lg font-sans'>
            {'Matches Per Region'}
          </Heading>
          {matchesStats && matchesStats.matchesByRegion && (
            <PieGraph
              data={matchesStats.matchesByRegion.filter((m) => m.value !== 0)}
              tooltip={'Matches Played: '}
              fillColors={regionsColors}
            />
          )}
        </div>
        <div>
          <Heading as='h2' className='mb-2.5 text-lg font-sans'>
            {'Battle Results'}
          </Heading>
          {matchesStats && matchesStats.battleResults && (
            <PieGraph
              data={matchesStats.battleResults.filter((m) => m.value !== 0)}
              tooltip={'Result Count: '}
              fillColors={resultsColors}
            />
          )}
        </div>
      </div>
    </div>
  );
};
