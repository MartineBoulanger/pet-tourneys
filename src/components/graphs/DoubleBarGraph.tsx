'use client';

import { BarChart, Bar, XAxis, Legend, Tooltip } from 'recharts';
import { useWindowSize } from '@/hooks/useWindowSize';
import { GraphWrapper } from './GraphWrapper';
import { DoubleBarGraphProps } from '@/types/graphs.types';
import { CustomTooltip } from './CustomTooltip';
import { CustomLegend } from './CustomLegend';

export const DoubleBarGraph = ({
  data,
  color,
  color2,
  tooltip,
  tooltip2,
  fillColors,
  legendValues = {},
  showLegend = false,
}: DoubleBarGraphProps) => {
  const { isMobile } = useWindowSize();

  if (!data || data.length === 0) {
    return (
      <p className='text-center bg-background rounded-lg p-2.5 lg:p-5'>
        {'No double bar chart data available.'}
      </p>
    );
  }

  return (
    <GraphWrapper className='p-2.5 lg:p-5 h-[425px] lg:h-[450px]'>
      <BarChart data={data} layout='horizontal'>
        <Tooltip
          content={(props) => (
            <CustomTooltip
              {...props}
              items={[{ label: tooltip ?? '' }, { label: tooltip2 ?? '' }]}
            />
          )}
        />
        <XAxis
          type='category'
          dataKey='name'
          tick={{ fontSize: isMobile ? 12 : 14, width: 100, fill: '#f1f1f1' }}
          height={50}
          angle={-10}
          stroke='transparent'
        />
        <Bar
          dataKey='value1'
          fill={color}
          radius={[8, 8, 0, 0]}
          label={{
            position: 'top',
            fontSize: isMobile ? 16 : 20,
            fontWeight: 'bold',
            offset: -20,
            fill: '#101010',
          }}
        />
        <Bar
          dataKey='value2'
          fill={color2}
          radius={[8, 8, 0, 0]}
          label={{
            position: 'top',
            fontSize: isMobile ? 16 : 20,
            fontWeight: 'bold',
            offset: -20,
            fill: '#101010',
          }}
        />
        {showLegend && (
          <Legend
            content={(props) => (
              <CustomLegend
                {...props}
                fillColors={fillColors}
                legendValues={legendValues}
              />
            )}
          />
        )}
      </BarChart>
    </GraphWrapper>
  );
};
