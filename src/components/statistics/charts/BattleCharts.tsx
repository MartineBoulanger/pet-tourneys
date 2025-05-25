import { BattleChartsProps } from '../types';
import { PieGraph } from '../graphs';
import { OverviewCard } from '../OverviewCard';
import { Heading } from '@/components/ui';
import { regionsColors, resultsColors } from '@/utils/constants';
import { cn } from '@/utils/cn';

export const BattleCharts = ({
  matchesStats,
  isMatchView,
}: BattleChartsProps) => {
  if (!matchesStats) {
    return (
      <p className='text-center bg-background rounded-lg py-5'>
        {'No battle charts data available.'}
      </p>
    );
  }

  return (
    <div className='mb-5 lg:mb-10'>
      <Heading as='h2' className='text-xl sm:text-3xl mb-2.5'>
        {isMatchView
          ? 'Overall Match Statistics'
          : 'Overall Tournament Statistics'}
      </Heading>
      <div className='flex flex-wrap flex-col md:flex-row gap-5 mb-5'>
        {!isMatchView && matchesStats?.totalMatches ? (
          <OverviewCard
            title='Total Matches'
            value={matchesStats.totalMatches}
          />
        ) : null}
        {matchesStats?.totalBattles ? (
          <OverviewCard
            title='Total Battles'
            value={matchesStats.totalBattles}
          />
        ) : null}
        {matchesStats?.averageDuration ? (
          <OverviewCard
            title='Average Battle Duration'
            value={matchesStats.averageDuration}
          />
        ) : null}
      </div>
      <div
        className={cn(
          'bg-light-grey rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-5 p-2.5 sm:p-5',
          isMatchView ? 'md:grid-cols-1' : ''
        )}
      >
        {!isMatchView ? (
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
        ) : null}
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
