import { PieGraph } from '@/features/recharts-graphs/PieGraph';
import {
  regionsColors,
  resultsColors,
  matchResultsColors,
} from '@/features/supabase/constants';
import { Heading } from '@/components/ui';
import { cn } from '@/utils/cn';
import { BattleChartsProps } from '../types';
import { OverviewCard } from '../OverviewCard';

export const BattleCharts = ({
  matchesStats,
  isMatchView = false,
}: BattleChartsProps) => {
  if (!matchesStats) {
    return (
      <p className='text-center bg-background rounded-lg p-2.5 lg:p-5'>
        {'No battle charts data available.'}
      </p>
    );
  }

  return (
    <div className='mb-5 lg:mb-10'>
      <Heading as='h2' className='text-xl lg:text-3xl mb-2.5'>
        {isMatchView ? 'Overall Match Statistics' : 'Overall League Statistics'}
      </Heading>
      <div className='flex flex-wrap flex-col md:flex-row gap-2.5 lg:gap-5 mb-5'>
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
        {!isMatchView && matchesStats.battleResults ? (
          <OverviewCard
            title='Total Battle Draws'
            value={
              matchesStats.battleResults.filter((m) => m.name === 'DRAWS')[0]
                .value
            }
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
          'bg-light-grey rounded-lg shadow-md grid grid-cols-1 lg:grid-cols-2 gap-2.5 lg:gap-5 p-2.5 lg:p-5',
          isMatchView ? 'md:grid-cols-1' : ''
        )}
      >
        {!isMatchView && matchesStats ? (
          <>
            <div>
              <Heading
                as='h2'
                className='mb-2.5 text-base lg:text-lg font-sans'
              >
                {'Matches Per Region'}
              </Heading>
              {matchesStats.matchesByRegion && (
                <PieGraph
                  data={matchesStats.matchesByRegion.filter(
                    (m) => m.value !== 0
                  )}
                  tooltip={'Matches Played: '}
                  fillColors={regionsColors}
                />
              )}
            </div>
            <div>
              <Heading
                as='h2'
                className='mb-2.5 text-base lg:text-lg font-sans'
              >
                {'Match Results'}
              </Heading>
              {matchesStats.matchResults && (
                <PieGraph
                  data={matchesStats.matchResults.filter((m) => m.value !== 0)}
                  tooltip={'Count: '}
                  fillColors={matchResultsColors}
                  showWholeLabel={false}
                  showLegend
                />
              )}
            </div>
          </>
        ) : null}
        {isMatchView && matchesStats ? (
          <div>
            <Heading
              as='h2'
              className='mb-2.5 w-full text-base lg:text-lg font-sans'
            >
              {'Battle Results'}
            </Heading>
            {matchesStats.battleResults && (
              <PieGraph
                data={matchesStats.battleResults.filter((m) => m.value !== 0)}
                tooltip={'Result Count: '}
                fillColors={resultsColors}
              />
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
