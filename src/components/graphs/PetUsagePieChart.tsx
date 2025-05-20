'use client';

import { useState, useEffect } from 'react';
import { Cell, PieChart, Pie, Tooltip, Legend } from 'recharts';
import { GraphWrapper } from './GraphWrapper';
import { PetUsagePieChartProps } from './types';
import { petTypeColors, breedColors } from '@/utils/constants';

export const PetUsagePieChart = ({
  types,
  breeds,
  defaultColor = '#303030',
}: PetUsagePieChartProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!types || !breeds || types.length === 0 || breeds.length === 0) {
    return <p className='text-center py-8'>{'No pet data available yet.'}</p>;
  }

  const totalPerBreed = breeds?.reduce((sum, entry) => sum + entry.value, 0);
  const totalPerType = types?.reduce((sum, entry) => sum + entry.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    const total = data.outerRadius === 150 ? totalPerBreed : totalPerType;
    const percentage = ((data.value / total) * 100).toFixed(1);

    return (
      <div className='bg-light-grey p-2.5 rounded-lg shadow-md'>
        <p className='font-bold text-light-blue'>{data.name}</p>
        <p>
          {'Count: '}
          {data.value}
        </p>
        <p>
          {'Percentage: '}
          {percentage}
          {'%'}
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
    name,
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
        {`${name.slice(0, 2)}: ${value}`}
      </text>
    );
  };

  const renderBreedLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    name,
    value,
  }: any) => {
    // Position outside the pie
    const radius = outerRadius + 25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Adjust text anchor based on position
    const textAnchor = Math.cos(-midAngle * RADIAN) > 0 ? 'start' : 'end';

    return (
      <text
        x={x}
        y={y}
        fill={breedColors[name as keyof typeof breedColors] || defaultColor}
        textAnchor={textAnchor}
        dominantBaseline='central'
        fontSize={isMobile ? 10 : 12}
        fontWeight='bold'
      >
        {`${name}: ${value}`}
      </text>
    );
  };

  return (
    <GraphWrapper>
      <PieChart>
        <Tooltip content={<CustomTooltip />} />

        <Pie
          data={types}
          outerRadius={100}
          minAngle={20}
          dataKey='value'
          fill={defaultColor}
          label={renderCustomizedLabel}
          labelLine={false}
        >
          {types.map((entry, index) => (
            <Cell
              key={`type-cell-${index}`}
              fill={
                petTypeColors[entry.name as keyof typeof petTypeColors] ||
                defaultColor
              }
            />
          ))}
        </Pie>

        <Pie
          data={breeds}
          innerRadius={120}
          outerRadius={150}
          dataKey='value'
          fill={defaultColor}
          label={renderBreedLabel}
          paddingAngle={3}
        >
          {breeds.map((entry, index) => (
            <Cell
              key={`breed-cell-${index}`}
              fill={
                breedColors[entry.name as keyof typeof breedColors] ||
                defaultColor
              }
            />
          ))}
        </Pie>
      </PieChart>
    </GraphWrapper>
  );
};
