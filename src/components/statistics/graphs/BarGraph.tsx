'use client';

import { BarChart, Bar, XAxis, Tooltip, TooltipProps } from 'recharts';
import { GraphWrapper } from './GraphWrapper';
import { useWindowSize } from '@/hooks/useWindowSize';
import { BarGraphProps } from './types';
import { capitalizeWord } from '@/utils/cn';

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

  const CustomTooltip = ({
    active,
    payload,
  }: TooltipProps<string | number, string | number>) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;

    return (
      <div className='bg-light-grey p-2.5 rounded-lg shadow-md'>
        <p className='font-bold text-humanoid'>{capitalizeWord(data.name)}</p>
        <p>
          {tooltip}
          {data.value}
        </p>
      </div>
    );
  };

  return (
    <GraphWrapper className='p-2.5 lg:p-5 h-[425px] md:h-[450px]'>
      <BarChart data={data} layout='horizontal'>
        <Tooltip content={<CustomTooltip />} />
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
      </BarChart>
    </GraphWrapper>
  );
};
