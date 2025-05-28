import { PetBattleLogProps } from '../types';
import { DoubleBarGraph, RadialGraph } from '../graphs';
import { Heading } from '@/components/ui';
import { OverviewCard } from '../OverviewCard';
import {
  petPerformanceLegendValuesColor,
  weatherColors,
} from '@/utils/constants';
import { petPerformanceLegendValues } from '@/utils/constants';

export const PetPerformanceCharts = ({ battleStats }: PetBattleLogProps) => {
  if (!battleStats) {
    return (
      <p className='text-center bg-background rounded-lg py-5'>
        {'No pet performance chart data available.'}
      </p>
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
    <div className='mb-5 sm:mb-10'>
      <Heading as='h2' className='text-xl sm:text-3xl mb-2.5'>
        {'Overall Pet Performance Statistics'}
      </Heading>
      <div className='flex flex-wrap flex-col md:flex-row gap-5 mb-5'>
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
      <div className='bg-light-grey rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-5 p-2.5 sm:p-5'>
        <div>
          <Heading as='h2' className='mb-2.5 text-lg font-sans'>
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
          <Heading as='h2' className='mb-2.5 text-lg font-sans'>
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
