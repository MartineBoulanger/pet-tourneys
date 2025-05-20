'use client';

import { useEffect, useState } from 'react';
import { ResponsiveContainer } from 'recharts';
import { Props } from 'recharts/types/component/ResponsiveContainer';
import { ChartSkeleton } from '@/components/ui';
import { cn } from '@/utils/cn';

interface GraphWrapperProps extends Props {
  containerHeight?: number | string;
}

export const GraphWrapper = ({
  children,
  className,
  containerHeight = 450,
  ...rest
}: GraphWrapperProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <ChartSkeleton />;

  return (
    <div
      className={cn('rounded-lg bg-background w-full', className)}
      style={{ height: containerHeight }}
    >
      <ResponsiveContainer {...rest}>{children}</ResponsiveContainer>
    </div>
  );
};
