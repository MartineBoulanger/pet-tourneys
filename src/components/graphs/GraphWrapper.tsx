import { cn } from '@/utils/cn';
import { GraphWrapperProps } from '@/types/graphs.types';

export const GraphWrapper = ({
  children,
  className,
  containerHeight = 450,
}: GraphWrapperProps) => {
  return (
    <div
      className={cn('rounded-lg bg-background w-full', className)}
      style={{ height: containerHeight, minWidth: 0 }}
    >
      {children}
    </div>
  );
};
