import { DoubleBarGraph } from '@/features/recharts-graphs/DoubleBarGraph';
import { RadialGraph } from '@/features/recharts-graphs/RadialGraph';
import {
  petPerformanceLegendValuesColor,
  weatherColors,
} from '@/features/supabase/constants';
import { petPerformanceLegendValues } from '@/features/supabase/constants';
import { Heading, Paragraph } from '@/components/ui';
import { PetBattleLogProps } from '../types';
import { OverviewCard } from '../OverviewCard';

export const PetPerformanceCharts = ({ battleStats }: PetBattleLogProps) => {
  if (!battleStats) {
    return (
      <Paragraph className='text-center bg-background rounded-lg p-2.5 lg:p-5'>
        {'No pet performance chart data available.'}
      </Paragraph>
    );
  }

  const pets =
    battleStats.petPerformance &&
    Object.entries(battleStats.petPerformance)
      .map(([petName, stats]) => ({
        name: petName,
        value1: stats.kills,
        value2: stats.deaths,
      }))
      .sort((a, b) => b.value1 - a.value1)
      .slice(0, 5);

  const weathers =
    battleStats.weatherChanges &&
    Object.entries(battleStats.weatherChanges.byType)
      .map(([type, count]) => ({
        name: type,
        value: count,
        fill: weatherColors[type] || '#303030',
      }))
      .sort((a, b) => b.value - a.value);

  return (
    <div className='mb-5 lg:mb-10'>
      <Heading as='h2' className='text-xl lg:text-3xl mb-2.5'>
        {'Overall Pet Performance Statistics'}
      </Heading>
      <div className='flex flex-wrap flex-col lg:flex-row gap-2.5 lg:gap-5 mb-5'>
        {battleStats?.totalWeatherChanges ? (
          <OverviewCard
            title='Total Weather Conditions'
            value={battleStats.totalWeatherChanges}
          />
        ) : null}
        {battleStats?.totalKills ? (
          <OverviewCard title='Total Kills' value={battleStats.totalKills} />
        ) : null}
        {battleStats?.totalDeaths ? (
          <OverviewCard title='Total Deaths' value={battleStats.totalDeaths} />
        ) : null}
      </div>
      <div className='bg-light-grey rounded-lg shadow-md grid grid-cols-1 lg:grid-cols-2 gap-2.5 lg:gap-5 p-2.5 lg:p-5'>
        <div>
          <Heading as='h2' className='mb-2.5 text-base lg:text-lg font-sans'>
            {'Top 5 Pet Assassins'}
          </Heading>
          {battleStats.petPerformance && (
            <DoubleBarGraph
              data={pets}
              tooltip={'Kills: '}
              tooltip2={'Deaths: '}
              color={'#11a7f6'}
              color2={'#d52824'}
              fillColors={petPerformanceLegendValuesColor}
              legendValues={petPerformanceLegendValues}
              showLegend
            />
          )}
        </div>
        <div>
          <Heading as='h2' className='mb-2.5 text-base lg:text-lg font-sans'>
            {'Weather Condition Applied'}
          </Heading>
          {battleStats.weatherChanges && (
            <RadialGraph
              data={weathers}
              tooltip={'Times Changed: '}
              showLegend
            />
          )}
        </div>
      </div>
    </div>
  );
};
