'use client';

import {
  PieSectorShapeProps,
  Sector,
  PieChart,
  Pie,
  Tooltip,
  PieLabelRenderProps,
} from 'recharts';
import { capitalizeWord } from '@/utils/capitalizeWord';
import { useWindowSize } from '@/hooks/useWindowSize';
import { GraphWrapper } from './GraphWrapper';
import { DoublePieGraphProps } from '@/types/graphs.types';
import { CustomTooltip } from './CustomTooltip';
import { calculatePercentage } from '@/utils/calculatePercentage';
import { Paragraph } from '@/components/ui';

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
      <Paragraph className='text-center bg-background rounded-lg p-2.5 lg:p-5'>
        {'No double pie chart data available.'}
      </Paragraph>
    );
  }

  // Calculate total for pet types and breeds
  const totalPetTypes = data.reduce((sum, item) => sum + Number(item.value), 0);
  const totalPetBreeds = data2.reduce(
    (sum, item) => sum + Number(item.value),
    0,
  );

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabelInnerPie = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    name,
    value,
  }: PieLabelRenderProps) => {
    const radius = 35 + (outerRadius - 25) * 0.5;
    const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

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
          ? `${name?.includes('/') ? name : capitalizeWord(name ?? '').charAt(0)}: ${value}`
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
  }: PieLabelRenderProps) => {
    // Position outside the pie
    const radius = outerRadius + 25;
    const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    // Adjust text anchor based on position
    const textAnchor =
      Math.cos(-(midAngle ?? 0) * RADIAN) > 0 ? 'start' : 'end';

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
        {showWholeLabel
          ? `${name?.includes('/') ? name : capitalizeWord(name ?? '')}: ${value}`
          : value}
      </text>
    );
  };

  const MyCustomInnerPie = (props: PieSectorShapeProps) => (
    <Sector
      {...props}
      fill={
        fillColors ? fillColors[props.name as keyof typeof fillColors] : color
      }
    />
  );

  const MyCustomOuterPie = (props: PieSectorShapeProps) => (
    <Sector
      {...props}
      fill={
        fillColors2
          ? fillColors2[props.name as keyof typeof fillColors2]
          : color
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
              getPercentage={(value, p) => {
                const isInnerPie = p.name === 'value';
                const total = isInnerPie ? totalPetTypes : totalPetBreeds;
                return calculatePercentage(value, total);
              }}
            />
          )}
        />

        <Pie
          data={data}
          outerRadius={isMobile ? 80 : 100}
          minAngle={20}
          dataKey='value'
          label={renderCustomizedLabelInnerPie}
          labelLine={false}
          shape={MyCustomInnerPie}
        ></Pie>

        <Pie
          data={data2}
          innerRadius={isMobile ? 95 : 115}
          outerRadius={isMobile ? 115 : 145}
          dataKey='value'
          label={renderCustomizedLabelOuterPie}
          paddingAngle={3}
          shape={MyCustomOuterPie}
        ></Pie>
      </PieChart>
    </GraphWrapper>
  );
};
