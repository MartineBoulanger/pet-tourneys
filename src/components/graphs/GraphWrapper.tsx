import { Suspense } from 'react';
import { ResponsiveContainer } from 'recharts';
import { ChartSkeleton } from '@/components/layout/Skeletons';
import { cn } from '@/utils/cn';
import { GraphWrapperProps } from '@/types/graphs.types';

export const GraphWrapper = ({
  children,
  className,
  containerHeight = 450,
  ...rest
}: GraphWrapperProps) => {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <div
        className={cn('rounded-lg bg-background w-full', className)}
        style={{ height: containerHeight }}
      >
        <ResponsiveContainer {...rest}>{children}</ResponsiveContainer>
      </div>
    </Suspense>
  );
};
