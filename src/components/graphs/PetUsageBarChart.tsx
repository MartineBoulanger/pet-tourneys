'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { GraphWrapper } from './GraphWrapper';
import { PetUsageBarChartProps } from './types';

export const PetUsageBarChart = ({
  pets,
  defaultColor = '#2f3648',
  maxMobileItems = 5,
}: PetUsageBarChartProps) => {
  if (!pets || pets.length === 0) {
    return (
      <p className='text-center py-8'>{'No pet usage data available yet.'}</p>
    );
  }

  const chartData = pets.map((pet) => ({
    name: pet.name,
    value: pet.total_played,
    stats: pet.stats,
    type: pet.type,
  }));

  let displayData;
  if (typeof window !== 'undefined') {
    displayData =
      window.innerWidth > 640 ? chartData : chartData.slice(0, maxMobileItems);
  } else {
    displayData = chartData.slice(0, maxMobileItems); // Default to mobile view during SSR
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;

    return (
      <div className='bg-light-grey p-2.5 rounded-lg shadow-md'>
        <p className='font-bold text-light-blue'>{data.name}</p>
        <p>
          {'Count: '}
          {data.value}
        </p>
      </div>
    );
  };

  return (
    <GraphWrapper className='p-2.5 md:p-5 h-[425px] md:h-[450px]'>
      <BarChart
        data={displayData}
        layout='horizontal'
        // margin={{ left: -30, top: 15 }}
      >
        <Tooltip
          content={<CustomTooltip />}
          wrapperClassName='bg-medium-grey'
        />
        {/* <YAxis type='number' orientation='left' />*/}
        <XAxis
          type='category'
          dataKey='name'
          tick={{ fontSize: 12 }}
          padding={{ left: 0, right: 0 }}
          className='truncate'
        />
        <Bar
          dataKey='value'
          fill={defaultColor}
          radius={[8, 8, 0, 0]}
          label={{
            position: 'top',
            fontSize: 20,
            angle: 10,
            offset: -6,
          }}
        />
      </BarChart>
    </GraphWrapper>
  );
};
