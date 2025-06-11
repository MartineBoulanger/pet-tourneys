'use client';

import {
  Legend,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  TooltipProps,
} from 'recharts';
import { GraphWrapper } from './GraphWrapper';
import { RadarGraphProps } from './types';
import { useWindowSize } from '@/hooks/useWindowSize';

export const RadarGraph = ({
  data,
  color = '#11a7f5',
  tooltip,
  legendText,
  radarName,
  angle = 60,
  showLegend = false,
}: RadarGraphProps) => {
  const { isMobile } = useWindowSize();

  if (!data || data.length === 0) {
    return (
      <p className='text-center bg-background rounded-lg py-5'>
        {'No radar chart data available.'}
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
      <div className='bg-light-grey p-2.5 sm:p-5 rounded-lg shadow-md'>
        <p className='font-bold text-humanoid'>{data.name}</p>
        <p>
          {tooltip}
          {data.value}
        </p>
      </div>
    );
  };

  const renderCustomLegendText = () => {
    return <span className='text-foreground text-sm'>{legendText}</span>;
  };

  return (
    <GraphWrapper className='h-[425px] md:h-[450px]'>
      <RadarChart
        cx='50%'
        cy='50%'
        outerRadius={isMobile ? '65%' : '70%'}
        data={data}
      >
        <Tooltip content={<CustomTooltip />} />
        <PolarGrid style={{ stroke: '#666666' }} />
        <PolarAngleAxis
          dataKey='name'
          tick={{ fontSize: isMobile ? 12 : 14, fill: '#f1f1f1', width: 100 }}
        />
        <PolarRadiusAxis angle={angle} stroke='#666666' />
        <Radar
          name={radarName}
          dataKey='value'
          stroke={color}
          fill={color}
          fillOpacity={0.5}
        />
        {showLegend && <Legend formatter={renderCustomLegendText} />}
      </RadarChart>
    </GraphWrapper>
  );
};
