'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartSkeleton } from '@/components/ui';
import { ChartProps } from '@/types';

export const PieGraph = ({ data, children }: ChartProps) => {
  const [isMounted, setIsMounted] = useState(false);
  // Calculate the total count
  const total = data?.reduce((sum, entry) => sum + entry.value, 0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <ChartSkeleton />;

  return (
    <div className='rounded-lg bg-background w-full h-[425px] md:h-[450px]'>
      <ResponsiveContainer width={'100%'} height={'100%'}>
        <PieChart width={500} height={500}>
          <Pie
            data={data}
            cx='50%'
            cy='50%'
            outerRadius={100}
            dataKey='value'
            fill='#222222'
            label
          >
            {children}
          </Pie>
          <Tooltip
            formatter={(value) =>
              `${(((value as number) / Number(total)) * 100).toFixed(1)}%`
            }
          />
          <Legend
            layout='horizontal'
            verticalAlign='bottom'
            wrapperStyle={{
              padding: window.innerWidth < 768 ? '10px' : '20px',
              fontSize: window.innerWidth < 768 ? '12px' : '16px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
