'use client';

import { useState, useEffect } from 'react';
import { Cell, PieChart, Pie, Tooltip, Legend } from 'recharts';
import { GraphWrapper } from './GraphWrapper';
import { BattleResultsPieChartProps } from './types';
import { resultsColors } from '@/utils/constants';

export const BattleResultsPieChart = ({
  results,
  defaultColor = '#303030',
}: BattleResultsPieChartProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!results || results.length === 0) {
    return (
      <p className='text-center py-8'>{'No battles data available yet.'}</p>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;

    return (
      <div className='bg-light-grey p-2.5 rounded-lg shadow-md'>
        <p className='font-bold text-light-blue'>{data.result}</p>
        <p>
          {'Result Count: '}
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
    result,
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
        {`${result}: ${value}`}
      </text>
    );
  };

  return (
    <GraphWrapper>
      <PieChart>
        <Tooltip content={<CustomTooltip />} />

        <Pie
          data={results}
          outerRadius={150}
          minAngle={20}
          dataKey='value'
          fill={defaultColor}
          label={renderCustomizedLabel}
          labelLine={false}
        >
          {results.map((entry, index) => (
            <Cell
              key={`result-cell-${index}`}
              fill={
                resultsColors[entry.result as keyof typeof resultsColors] ||
                defaultColor
              }
            />
          ))}
        </Pie>
      </PieChart>
    </GraphWrapper>
  );
};
