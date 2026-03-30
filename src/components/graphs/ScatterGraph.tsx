'use client';

import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { useWindowSize } from '@/hooks/useWindowSize';
import { GraphWrapper } from './GraphWrapper';
import { ScatterGraphProps } from '@/types/graphs.types';
import { CustomTooltip } from './CustomTooltip';

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
          content={(props) => (
            <CustomTooltip
              {...props}
              items={[
                { label: tooltipNamePrefix ?? '' },
                { label: tooltip ?? '' },
              ]}
            />
          )}
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
