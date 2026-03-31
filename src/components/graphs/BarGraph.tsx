'use client';

import { BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { useWindowSize } from '@/hooks/useWindowSize';
import { GraphWrapper } from './GraphWrapper';
import { BarGraphProps } from '@/types/graphs.types';
import { RechartsDevtools } from '@recharts/devtools';
import { CustomTooltip } from './CustomTooltip';

export const BarGraph = ({
  data,
  color = '#11a7f5',
  color2 = '#101010',
  tooltip,
}: BarGraphProps) => {
  const { isMobile } = useWindowSize();

  if (!data || data.length === 0) {
    return (
      <p className='text-center bg-background rounded-lg p-2.5 lg:p-5'>
        {'No pie chart data available.'}
      </p>
    );
  }

  return (
    <GraphWrapper className='p-2.5 lg:p-5 h-[425px] lg:h-[450px]'>
      <BarChart data={data} layout='horizontal'>
        <Tooltip
          content={(props) => (
            <CustomTooltip {...props} prefix={tooltip} capitalize />
          )}
        />
        <XAxis
          type='category'
          dataKey='name'
          tick={{ fontSize: isMobile ? 12 : 14, width: 100, fill: '#f1f1f1' }}
          padding={{ left: 0, right: 0 }}
          height={50}
          angle={-10}
          stroke='transparent'
        />
        <Bar
          dataKey='value'
          fill={color}
          radius={[8, 8, 0, 0]}
          label={{
            position: 'top',
            fontSize: isMobile ? 16 : 20,
            fontWeight: 'bold',
            offset: -20,
            fill: color2,
          }}
        />
        <RechartsDevtools />
      </BarChart>
    </GraphWrapper>
  );
};
