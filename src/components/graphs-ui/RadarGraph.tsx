'use client';

import { useState, useEffect } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { ChartSkeleton } from '@/components/ui';
import { iRadarGraphProps } from './types';

export const RadarGraph = ({
  data,
  polarAngleKey,
  radarDataKey,
  width = '100%',
  height = 450,
  colors = ['#2f3648'],
  margin = { top: 20, right: 20, bottom: 20, left: 20 },
  showLegend = true,
  legendProps = {},
  tooltipProps = {},
  polarRadiusProps = {},
  ...rest
}: iRadarGraphProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <ChartSkeleton />;

  return (
    <div className='rounded-lg bg-background w-full' style={{ height }}>
      <ResponsiveContainer width={width} height='100%'>
        <RadarChart
          cx='50%'
          cy='50%'
          outerRadius='80%'
          data={data}
          margin={margin}
          {...rest}
        >
          <PolarGrid />
          <PolarAngleAxis dataKey={polarAngleKey} />
          <PolarRadiusAxis {...polarRadiusProps} />
          {Array.isArray(radarDataKey) ? (
            radarDataKey.map((key, index) => (
              <Radar
                key={key}
                name={key}
                dataKey={key}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.7}
              />
            ))
          ) : (
            <Radar
              name={radarDataKey}
              dataKey={radarDataKey}
              stroke={colors[0]}
              fill={colors[0]}
              fillOpacity={0.7}
            />
          )}
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
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

// docs : https://recharts.org/en-US/guide
