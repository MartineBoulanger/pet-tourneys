import { PieGraph } from '@/features/recharts-graphs/PieGraph';
import {
  regionsColors,
  resultsColors,
  matchResultsColors,
} from '@/features/supabase/constants';
import { Heading, Paragraph } from '@/components/ui';
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

  const totalMatches = matchesStats?.totalMatches || 0;
  const totalBattles = matchesStats?.totalBattles || 0;
  const averageDuration = matchesStats?.averageDuration || '';
  const battleResults = matchesStats?.battleResults || [];
  const matchesByRegion = matchesStats?.matchesByRegion || [];
  const matchResults = matchesStats?.matchResults || [];
  const drawsCount =
    battleResults.filter((m) => m?.name === 'DRAWS')[0]?.value || 0;

  return (
    <div className='mb-5 lg:mb-10'>
      <Heading as='h2' className='text-xl lg:text-3xl mb-2.5'>
        {isMatchView ? 'Overall Match Statistics' : 'Overall League Statistics'}
      </Heading>
      <div className='flex flex-wrap flex-col md:flex-row gap-2.5 lg:gap-5 mb-5'>
        {!isMatchView && totalMatches > 0 ? (
          <OverviewCard title='Total Matches' value={totalMatches} />
        ) : null}
        {totalBattles > 0 ? (
          <OverviewCard title='Total Battles' value={totalBattles} />
        ) : null}
        {!isMatchView && battleResults.length > 0 ? (
          <OverviewCard title='Total Battle Draws' value={drawsCount} />
        ) : null}
        {averageDuration !== '' ? (
          <OverviewCard
            title='Average Battle Duration'
            value={averageDuration}
          />
        ) : null}
      </div>
      <div
        className={cn(
          'bg-light-grey rounded-lg shadow-md grid grid-cols-1 lg:grid-cols-2 gap-2.5 lg:gap-5 p-2.5 lg:p-5',
          isMatchView ? 'md:grid-cols-1' : ''
        )}
      >
        {!isMatchView ? (
          <>
            <div>
              <Heading
                as='h2'
                className='mb-2.5 text-base lg:text-lg font-sans'
              >
                {'Matches Per Region'}
              </Heading>
              {matchesByRegion.length > 0 ? (
                <PieGraph
                  data={matchesByRegion.filter((m) => m?.value !== 0)}
                  tooltip={'Matches Played: '}
                  fillColors={regionsColors}
                />
              ) : (
                <Paragraph className='w-full bg-background text-center py-5 rounded-lg'>
                  {'No matches per region available.'}
                </Paragraph>
              )}
            </div>
            <div>
              <Heading
                as='h2'
                className='mb-2.5 text-base lg:text-lg font-sans'
              >
                {'Match Results'}
              </Heading>
              {matchResults.length > 0 ? (
                <PieGraph
                  data={matchResults.filter((m) => m?.value !== 0)}
                  tooltip={'Count: '}
                  fillColors={matchResultsColors}
                  showWholeLabel={false}
                  showLegend
                />
              ) : (
                <Paragraph className='w-full bg-background text-center py-5 rounded-lg'>
                  {'No match results available.'}
                </Paragraph>
              )}
            </div>
          </>
        ) : null}
        {isMatchView ? (
          <div>
            <Heading
              as='h2'
              className='mb-2.5 w-full text-base lg:text-lg font-sans'
            >
              {'Battle Results'}
            </Heading>
            {battleResults.length > 0 ? (
              <PieGraph
                data={battleResults.filter((m) => m?.value !== 0)}
                tooltip={'Result Count: '}
                fillColors={resultsColors}
              />
            ) : (
              <Paragraph className='w-full bg-background text-center py-5 rounded-lg'>
                {'No battle results available.'}
              </Paragraph>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
