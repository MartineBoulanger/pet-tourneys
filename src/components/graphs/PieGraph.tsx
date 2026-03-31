'use client';

import {
  Cell,
  PieChart,
  Pie,
  Tooltip,
  Legend,
  PieLabelRenderProps,
} from 'recharts';
import { useWindowSize } from '@/hooks/useWindowSize';
import { capitalizeWord } from '@/utils/capitalizeWord';
import { GraphWrapper } from './GraphWrapper';
import { GraphsProps, DataType } from '@/types/graphs.types';
import { CustomTooltip } from './CustomTooltip';

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
      <p className='text-center bg-background rounded-lg p-2.5 lg:p-5'>
        {'No pie chart data available.'}
      </p>
    );
  }

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    name,
    value,
  }: PieLabelRenderProps) => {
    const radius = 25 + (outerRadius - 50) * 0.5;
    const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

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
        {showWholeLabel ? `${capitalizeWord(name || '')}: ${value}` : value}
      </text>
    );
  };

  return (
    <GraphWrapper className='p-2.5 lg:p-5 h-[425px] lg:h-[450px]'>
      <PieChart>
        <Tooltip
          content={(props) => (
            <CustomTooltip {...props} prefix={tooltip} capitalize />
          )}
        />

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
