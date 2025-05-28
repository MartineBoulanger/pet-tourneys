/* eslint-disable @typescript-eslint/no-explicit-any*/

'use client';

import { Cell, PieChart, Pie, Tooltip, Legend, TooltipProps } from 'recharts';
import { GraphWrapper } from './GraphWrapper';
import { GraphsProps, DataType } from './types';
import { useWindowSize } from '@/hooks/useWindowSize';
import { capitalizeWord } from '@/utils/cn';

export const PieGraph = ({
  data,
  showLegend = false,
  showWholeLabel = true,
  fillColors,
  color = '#303030',
  tooltip,
}: GraphsProps<DataType>) => {
  const { isMobile } = useWindowSize();

  if (!data || data.length === 0) {
    return (
      <p className='text-center bg-background rounded-lg py-5'>
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

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    name,
    value,
  }: any) => {
    const radius = 25 + (outerRadius - 50) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill='#f1f1f1'
        textAnchor='middle'
        dominantBaseline='central'
        fontSize={isMobile ? 12 : 14}
        fontWeight='bold'
      >
        {showWholeLabel ? `${capitalizeWord(name)}: ${value}` : value}
      </text>
    );
  };

  return (
    <GraphWrapper className='p-2.5 sm:p-5 h-[425px] md:h-[450px]'>
      <PieChart>
        <Tooltip content={<CustomTooltip />} />

        <Pie
          data={data}
          outerRadius={isMobile ? 120 : 150}
          minAngle={20}
          dataKey='value'
          label={renderCustomizedLabel}
          labelLine={false}
          stroke='#f1f1f1'
        >
          {data.map((entry, index) => (
            <Cell
              key={`${entry.name}-cell-${index}`}
              fill={
                fillColors
                  ? fillColors[entry.name as keyof typeof fillColors]
                  : color
              }
            />
          ))}
        </Pie>

        {showLegend ? <Legend /> : null}
      </PieChart>
    </GraphWrapper>
  );
};
