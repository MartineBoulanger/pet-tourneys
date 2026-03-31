import { DoubleBarGraph } from '@/components/graphs/DoubleBarGraph';
import { RadialGraph } from '@/components/graphs/RadialGraph';
import { Heading, Paragraph } from '@/components/ui';
import { OverviewCard } from '@/components/layout/OverviewCard';
import { WEATHER_COLORS } from '@/types/supabase.types';
import { PetPerformanceChartProps } from '@/types/components.types';

const petPerformanceLegendValues = {
  value1: 'Kills',
  value2: 'Deaths',
};

const petPerformanceLegendValuesColor = {
  value1: '#11a7f6',
  value2: '#dc2626',
};

export const PetPerformanceCharts = ({
  battleStats,
}: PetPerformanceChartProps) => {
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
        fill: WEATHER_COLORS[type as keyof typeof WEATHER_COLORS] || '#303030',
      }))
      .sort((a, b) => b.value - a.value);

  return (
    <div className='mb-5 lg:mb-10'>
      <Heading as='h2' className='mb-2.5 text-foreground/65'>
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
          <Heading as='h3' className='text-base'>
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
          <Heading as='h3' className='text-base'>
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
