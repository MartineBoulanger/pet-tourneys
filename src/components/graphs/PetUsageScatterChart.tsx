'use client';

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { GraphWrapper } from './GraphWrapper';
import { PetUsageScatterChartProps } from './types';
import { COLORS } from '@/utils/constants';

export const PetUsageScatterChart = ({
  data,
  stat,
  defaultColor = '#2f3648',
}: PetUsageScatterChartProps) => {
  if (!data || data.length === 0) {
    return (
      <p className='text-center py-8'>{'No pet stats data available yet.'}</p>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;

    return (
      <div className='bg-light-grey p-2.5 rounded-lg shadow-md'>
        <p className='font-bold text-light-blue'>
          {stat} - {data.value}
        </p>
        <p>
          {'Count: '}
          {data.count}
        </p>
      </div>
    );
  };

  return (
    <GraphWrapper className='p-2.5 md:p-5 h-[425px] md:h-[450px]'>
      <ScatterChart
        margin={{
          top: 10,
          right: 10,
          bottom: -10,
          left: -20,
        }}
        width={500}
        height={500}
      >
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ strokeDasharray: '3 3', stroke: '#8ec5ff' }}
        />
        <CartesianGrid strokeDasharray='3 3' stroke='#202020' />
        <XAxis
          type='number'
          dataKey='value'
          unit={stat}
          tick={{ fontSize: 12 }}
        />
        <YAxis type='number' dataKey='count' />
        <Scatter data={data} fill={defaultColor} shape='circle'>
          {data.map((_, index) => (
            <Cell
              key={`${stat}-cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Scatter>
      </ScatterChart>
    </GraphWrapper>
  );
};
