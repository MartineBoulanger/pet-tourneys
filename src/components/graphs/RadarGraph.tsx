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
import { Paragraph } from '@/components/ui';

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
      <Paragraph className='text-center bg-background rounded-lg py-5'>
        {'No radar chart data available.'}
      </Paragraph>
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
        width='100%'
        height='100%'
      >
        <Tooltip
          content={(props) => <CustomTooltip {...props} prefix={tooltip} />}
        />
        <PolarGrid style={{ stroke: '#303030' }} />
        <PolarAngleAxis
          dataKey='name'
          tick={{ fontSize: isMobile ? 12 : 14, fill: '#f1f1f1', width: 100 }}
        />
        <PolarRadiusAxis
          angle={angle}
          orientation='left'
          tick={{ fontSize: 10, fill: '#666666' }}
          stroke='#303030'
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
