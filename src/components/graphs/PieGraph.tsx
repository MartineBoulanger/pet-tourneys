'use client';

import {
  PieSectorShapeProps,
  Sector,
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
import { Paragraph } from '@/components/ui';

export const PieGraph = ({
  data,
  showLegend = false,
  showWholeLabel = true,
  fillColors,
  color = '#303030',
  tooltip,
  capitalize = false,
}: GraphsProps<DataType>) => {
  const { isMobile } = useWindowSize();

  if (!data || data.length === 0) {
    return (
      <Paragraph className='text-center bg-background rounded-lg p-2.5 lg:p-5'>
        {'No pie chart data available.'}
      </Paragraph>
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
        {showWholeLabel
          ? `${capitalize ? capitalizeWord(name ?? '') : name}: ${value}`
          : value}
      </text>
    );
  };

  const MyCustomPie = (props: PieSectorShapeProps) => (
    <Sector
      {...props}
      fill={
        fillColors ? fillColors[props.name as keyof typeof fillColors] : color
      }
    />
  );

  return (
    <GraphWrapper className='p-2.5 lg:p-5 h-[425px] lg:h-[450px]'>
      <PieChart>
        <Tooltip
          content={(props) => (
            <CustomTooltip
              {...props}
              prefix={tooltip}
              capitalize={capitalize}
            />
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
          shape={MyCustomPie}
        ></Pie>

        {showLegend ? <Legend /> : null}
      </PieChart>
    </GraphWrapper>
  );
};
