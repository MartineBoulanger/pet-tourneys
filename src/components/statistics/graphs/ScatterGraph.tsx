'use client';

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  TooltipProps,
} from 'recharts';
import { GraphWrapper } from './GraphWrapper';
import { ScatterGraphProps } from './types';
import { useWindowSize } from '@/hooks/useWindowSize';

export const ScatterGraph = ({
  data,
  colors,
  color = '#303030',
  tooltipNamePrefix,
  tooltip,
}: ScatterGraphProps) => {
  const { isMobile } = useWindowSize();

  if (!data || data.length === 0) {
    return (
      <p className='text-center bg-background rounded-lg p-2.5 lg:p-5'>
        {'No scatter chart data available.'}
      </p>
    );
  }

  const CustomTooltip = ({
    active,
    payload,
  }: TooltipProps<string | number, string | number>) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;

    return (
      <div className='bg-light-grey p-2.5 rounded-lg shadow-md'>
        <p className='font-bold text-humanoid'>
          {tooltipNamePrefix}
          {data.name}
        </p>
        <p>
          {tooltip}
          {data.value}
        </p>
      </div>
    );
  };

  return (
    <GraphWrapper className='p-2.5 lg:p-5 h-[425px] lg:h-[450px]'>
      <ScatterChart
        margin={{
          top: 10,
          right: 10,
          bottom: -10,
          left: -20,
        }}
        width={isMobile ? 350 : 500}
        height={isMobile ? 350 : 500}
      >
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ strokeDasharray: '3 3', stroke: '#8ec5ff' }}
        />
        <XAxis
          type='number'
          dataKey='name'
          tick={{ fontSize: isMobile ? 12 : 14, fill: '#f1f1f1' }}
          domain={['dataMin', 'dataMax']}
        />
        <YAxis
          type='number'
          dataKey='value'
          tick={{ fontSize: isMobile ? 12 : 14 }}
          domain={['dataMin', 'dataMax']}
        />
        <Scatter data={data} shape='diamond'>
          {data.map((entry, index) => (
            <Cell
              key={`${entry.name}-cell-${index}`}
              fill={colors ? colors[index % colors.length] : color}
            />
          ))}
        </Scatter>
      </ScatterChart>
    </GraphWrapper>
  );
};
