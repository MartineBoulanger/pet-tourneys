'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartSkeleton } from '@/components/ui';

interface LineGraphProps {
  data: { count: number; value: number }[] | undefined;
}

export const LineGraph = ({ data }: LineGraphProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <ChartSkeleton />;

  return (
    <div className='p-2.5 md:p-5 rounded-lg bg-background w-full h-[425px] md:h-[450px]'>
      <ResponsiveContainer width={'100%'} height={'100%'}>
        <LineChart data={data} margin={{ top: 20 }} accessibilityLayer>
          <CartesianGrid strokeDasharray='3 3' stroke='#202020' />
          <XAxis dataKey='value' padding={{ left: 5, right: 5 }} />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: '#f1f1f1',
              color: '#111111',
              borderRadius: '0.5rem',
              border: 'none',
            }}
            formatter={(value) => [`Times used: ${value}`]}
          />
          <Line
            type='monotone'
            dataKey='count'
            stroke='#8ec5ff'
            activeDot={{ r: 8 }}
          ></Line>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
