'use client';

import {
  Legend,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
} from 'recharts';
import { useWindowSize } from '@/hooks/useWindowSize';
import { GraphWrapper } from './GraphWrapper';
import { RadarGraphProps } from '@/types/graphs.types';
import { CustomTooltip } from './CustomTooltip';

export const RadarGraph = ({
  data,
  color = '#11a7f5',
  tooltip,
  legendText,
  radarName,
  angle = 90,
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

  const renderCustomLegendText = () => {
    return <span className='text-foreground text-sm'>{legendText}</span>;
  };

  return (
    <GraphWrapper className='h-[425px] lg:h-[450px]'>
      <RadarChart
        cx='50%'
        cy='50%'
        outerRadius={isMobile ? '65%' : '70%'}
        data={data}
      >
        <Tooltip
          content={(props) => <CustomTooltip {...props} prefix={tooltip} />}
        />
        <PolarGrid style={{ stroke: '#666666' }} />
        <PolarAngleAxis
          dataKey='name'
          tick={{ fontSize: isMobile ? 12 : 14, fill: '#f1f1f1', width: 100 }}
        />
        <PolarRadiusAxis
          angle={angle}
          orientation='left'
          tick={{ fontSize: 10, fill: '#999999' }}
          stroke='#666666'
        />
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
