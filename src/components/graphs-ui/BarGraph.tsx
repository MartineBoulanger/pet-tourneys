'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartSkeleton } from '@/components/ui';
import { BarGraphProps } from './types';

export const BarGraph = ({
  data,
  defaultColor = '#2f3648',
  tooltipTextColor = '#111111',
  tooltipHoverColor = '#f1f1f1',
}: BarGraphProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <ChartSkeleton />;

  return (
    <div className='p-2.5 md:p-5 rounded-lg bg-background w-full h-[425px] md:h-[450px]'>
      <ResponsiveContainer width='100%' height={' 100%'}>
        <BarChart data={data} layout='horizontal'>
          <YAxis type='number' />
          <XAxis
            type='category'
            dataKey='name'
            width={100}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipHoverColor,
              color: tooltipTextColor,
              borderRadius: '0.5rem',
              border: 'none',
            }}
            formatter={(value, name, props) => [
              `Times played: ${value}`,
              `Type: ${props.payload.type || 'N/A'}`,
              `Stats: ${props.payload.stats || 'N/A'}`,
            ]}
          />
          <Bar dataKey='value' fill={defaultColor} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
