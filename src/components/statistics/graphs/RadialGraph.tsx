'use client';

import {
  Cell,
  RadialBarChart,
  RadialBar,
  Tooltip,
  Legend,
  TooltipProps,
} from 'recharts';
import { GraphWrapper } from './GraphWrapper';
import { GraphsProps, DataTypeWithFill } from './types';
import { useWindowSize } from '@/hooks/useWindowSize';

export const RadialGraph = ({
  data,
  tooltip,
  showLegend = true,
}: GraphsProps<DataTypeWithFill>) => {
  const { isMobile } = useWindowSize();

  if (!data || data.length === 0) {
    return (
      <p className='text-center bg-background rounded-lg py-5'>
        {'No radial chart data available.'}
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

  return (
    <GraphWrapper className='p-2.5 lg:p-5 h-[425px] md:h-[450px]'>
      <RadialBarChart
        cx='50%'
        cy='50%'
        innerRadius={isMobile ? '15%' : '30%'}
        outerRadius={isMobile ? '90%' : '100%'}
        data={data}
        startAngle={0}
        endAngle={180}
        barSize={isMobile ? 20 : 30}
      >
        <Tooltip content={<CustomTooltip />} />
        <RadialBar
          angleAxisId={0}
          dataKey='value'
          label={{
            position: 'insideEnd',
            fill: '#101010',
            fontSize: 11,
            fontWeight: 'bold',
          }}
          background={{ fill: '#303030' }}
        >
          {data.map((entry, index) => (
            <Cell key={`${entry.name}-cell-${index}`} fill={entry.fill} />
          ))}
        </RadialBar>
        {showLegend ? (
          <Legend
            layout='horizontal'
            verticalAlign='bottom'
            align='center'
            margin={{ bottom: 20, top: -40, right: 20, left: 20 }}
          />
        ) : null}
      </RadialBarChart>
    </GraphWrapper>
  );
};
