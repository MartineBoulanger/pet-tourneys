'use client';

import { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ChartSkeleton } from '@/components/ui';
import { iPieGraphProps } from '@/types';

export const PieGraph = ({
  data,
  dataKey,
  nameKey = 'name',
  width = '100%',
  height = 450,
  colors = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57'],
  margin = { top: 20, right: 20, bottom: 20, left: 20 },
  showLegend = true,
  legendProps = {},
  tooltipProps = {},
  outerRadius = 100,
  label = false,
  labelProps = {},
  children,
  ...rest
}: iPieGraphProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <ChartSkeleton />;

  return (
    <div className='rounded-lg bg-background w-full' style={{ height }}>
      <ResponsiveContainer width={width} height='100%'>
        <PieChart margin={margin} {...rest}>
          <Pie
            data={data}
            cx='50%'
            cy='50%'
            outerRadius={outerRadius}
            dataKey={dataKey}
            nameKey={nameKey}
            label={label}
            // label={label ? labelProps : false}
          >
            {data?.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
            {children}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#f1f1f1',
              color: '#111111',
              borderRadius: '0.5rem',
              border: 'none',
            }}
            formatter={(value, name, props) => {
              const total = data.reduce(
                (sum, entry) => sum + entry[dataKey],
                0
              );
              return [
                `${name}`,
                `${((Number(value) / total) * 100).toFixed(1)}%`,
              ];
            }}
            {...tooltipProps}
          />
          {showLegend && (
            <Legend
              layout='horizontal'
              verticalAlign='bottom'
              wrapperStyle={{
                padding: '10px',
                fontSize: '12px',
              }}
              {...legendProps}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
