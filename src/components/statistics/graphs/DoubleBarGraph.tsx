'use client';

import { BarChart, Bar, XAxis, Legend, Tooltip, TooltipProps } from 'recharts';
import { GoDotFill } from 'react-icons/go';
import { GraphWrapper } from './GraphWrapper';
import { DoubleBarGraphProps } from './types';
import { useWindowSize } from '@/hooks/useWindowSize';

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

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<string | number, string | number>) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <div className='bg-light-grey p-2.5 rounded-lg shadow-md'>
        <p className='font-bold text-humanoid'>{label}</p>
        <p>
          {tooltip}
          {payload[0].value}
        </p>
        <p>
          {tooltip2}
          {payload[1].value}
        </p>
      </div>
    );
  };

  const renderCustomLegend = (props: any) => {
    const { payload } = props;

    return (
      <ul className='flex gap-2.5 lg:gap-5 items-center justify-center'>
        {payload &&
          payload.map(
            (
              entry: { name: string | number; value: string | number },
              index: number
            ) => (
              <li
                key={`${entry.name}-item-${index}`}
                className='flex items-center'
                style={{
                  color: fillColors ? fillColors[entry.value] : '#f1f1f1',
                }}
              >
                <GoDotFill />
                {legendValues[entry.value]}
              </li>
            )
          )}
      </ul>
    );
  };

  return (
    <GraphWrapper className='p-2.5 lg:p-5 h-[425px] lg:h-[450px]'>
      <BarChart data={data} layout='horizontal'>
        <Tooltip content={<CustomTooltip />} />
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
        {showLegend && <Legend content={renderCustomLegend} />}
      </BarChart>
    </GraphWrapper>
  );
};
