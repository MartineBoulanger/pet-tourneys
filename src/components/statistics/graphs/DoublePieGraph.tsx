/* eslint-disable @typescript-eslint/no-explicit-any*/

'use client';

import { Cell, PieChart, Pie, Tooltip, TooltipProps } from 'recharts';
import { GraphWrapper } from './GraphWrapper';
import { DoublePieGraphProps } from './types';
import { capitalizeWord } from '@/utils/cn';
import { useWindowSize } from '@/hooks/useWindowSize';

export const DoublePieGraph = ({
  data,
  data2,
  color = '#303030',
  showWholeLabel = true,
  fillColors,
  fillColors2,
  tooltip,
}: DoublePieGraphProps) => {
  const { isMobile } = useWindowSize();

  if (!data || !data2 || data.length === 0 || data2.length === 0) {
    return (
      <p className='text-center bg-background rounded-lg p-2.5 lg:p-5'>
        {'No double pie chart data available.'}
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
        <p className='font-bold text-humanoid'>{data.name}</p>
        <p>
          {tooltip}
          {data.value}
        </p>
      </div>
    );
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabelInnerPie = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    name,
    value,
  }: any) => {
    const radius = 35 + (outerRadius - 25) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill='#f1f1f1'
        textAnchor='middle'
        dominantBaseline='central'
        fontSize={isMobile ? 10 : 12}
        fontWeight='bold'
      >
        {showWholeLabel
          ? `${capitalizeWord(name.slice(0, 2))}: ${value}`
          : value}
      </text>
    );
  };

  const renderCustomizedLabelOuterPie = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    name,
    value,
  }: any) => {
    // Position outside the pie
    const radius = outerRadius + 25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Adjust text anchor based on position
    const textAnchor = Math.cos(-midAngle * RADIAN) > 0 ? 'start' : 'end';

    return (
      <text
        x={x}
        y={y}
        fill={
          fillColors2
            ? fillColors2[name as keyof typeof fillColors2]
            : '#f1f1f1'
        }
        textAnchor={textAnchor}
        dominantBaseline='central'
        fontSize={isMobile ? 10 : 12}
        fontWeight='bold'
      >
        {showWholeLabel ? `${capitalizeWord(name)}: ${value}` : value}
      </text>
    );
  };

  return (
    <GraphWrapper className='p-2.5 lg:p-5 h-[425px] md:h-[450px]'>
      <PieChart>
        <Tooltip content={<CustomTooltip />} />

        <Pie
          data={data}
          outerRadius={isMobile ? 80 : 100}
          minAngle={20}
          dataKey='value'
          label={renderCustomizedLabelInnerPie}
          labelLine={false}
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

        <Pie
          data={data2}
          innerRadius={isMobile ? 95 : 115}
          outerRadius={isMobile ? 115 : 145}
          dataKey='value'
          label={renderCustomizedLabelOuterPie}
          paddingAngle={3}
        >
          {data2.map((entry, index) => (
            <Cell
              key={`${entry.name}-cell-${index}`}
              fill={
                fillColors2
                  ? fillColors2[entry.name as keyof typeof fillColors2]
                  : color
              }
            />
          ))}
        </Pie>
      </PieChart>
    </GraphWrapper>
  );
};
