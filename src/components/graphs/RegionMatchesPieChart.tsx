'use client';

import { useState, useEffect } from 'react';
import { Cell, PieChart, Pie, Tooltip, Legend } from 'recharts';
import { GraphWrapper } from './GraphWrapper';
import { RegionMatchesPieChartProps } from './types';
import { regionsColors } from '@/utils/constants';

export const RegionMatchesPieChart = ({
  regions,
  defaultColor = '#303030',
}: RegionMatchesPieChartProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!regions || regions.length === 0) {
    return (
      <p className='text-center py-8'>{'No matches data available yet.'}</p>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;

    return (
      <div className='bg-light-grey p-2.5 rounded-lg shadow-md'>
        <p className='font-bold text-light-blue'>{data.region}</p>
        <p>
          {'Matches Played: '}
          {data.value}
        </p>
      </div>
    );
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    region,
    value,
  }: any) => {
    const radius = innerRadius + (150 - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill='white'
        textAnchor='middle'
        dominantBaseline='central'
        fontSize={isMobile ? 10 : 12}
        fontWeight='bold'
      >
        {`${region}: ${value}`}
      </text>
    );
  };

  return (
    <GraphWrapper>
      <PieChart>
        <Tooltip content={<CustomTooltip />} />

        <Pie
          data={regions}
          outerRadius={150}
          minAngle={20}
          dataKey='value'
          fill={defaultColor}
          label={renderCustomizedLabel}
          labelLine={false}
        >
          {regions.map((entry, index) => (
            <Cell
              key={`region-cell-${index}`}
              fill={
                regionsColors[entry.region as keyof typeof regionsColors] ||
                defaultColor
              }
            />
          ))}
        </Pie>
      </PieChart>
    </GraphWrapper>
  );
};
