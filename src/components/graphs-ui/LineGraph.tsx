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
  Legend,
} from 'recharts';
import { iLineGraphProps } from './types';
import { ChartSkeleton } from '@/components/ui';

export const LineGraph = ({
  data,
  xAxisKey,
  lineDataKeys,
  width = '100%',
  height = 400,
  colors = ['#8ec5ff'],
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  showLegend = true,
  legendProps = {},
  tooltipProps = {},
  gridProps = {},
  lineProps = {},
  ...rest
}: iLineGraphProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <ChartSkeleton />;

  return (
    <div
      className='p-2.5 md:p-5 rounded-lg bg-background w-full'
      style={{ height }}
    >
      <ResponsiveContainer width={width} height='100%'>
        <LineChart data={data} margin={margin} {...rest}>
          <CartesianGrid
            strokeDasharray='3 3'
            stroke='#202020'
            {...gridProps}
          />
          <XAxis dataKey={xAxisKey} padding={{ left: 5, right: 5 }} />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: '#f1f1f1',
              color: '#111111',
              borderRadius: '0.5rem',
              border: 'none',
            }}
            {...tooltipProps}
          />
          {showLegend && <Legend {...legendProps} />}
          {Array.isArray(lineDataKeys) ? (
            lineDataKeys.map((item, index) => {
              const key = typeof item === 'string' ? item : item.key;
              const color =
                typeof item === 'string'
                  ? colors[index % colors.length]
                  : item.color || colors[index % colors.length];
              return (
                <Line
                  key={key}
                  type='monotone'
                  dataKey={key}
                  stroke={color}
                  activeDot={{ r: 8 }}
                  {...lineProps}
                />
              );
            })
          ) : (
            <Line
              type='monotone'
              dataKey={lineDataKeys}
              stroke={colors[0]}
              activeDot={{ r: 8 }}
              {...lineProps}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
