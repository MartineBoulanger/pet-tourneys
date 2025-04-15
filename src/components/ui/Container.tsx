import { cn } from '@/utils/cn';
import { ContainerProps } from '@/types';

export const Container = ({ className, children }: ContainerProps) => {
  return (
    <div className={cn('max-w-screen-2xl mx-auto my-5 sm:my-10', className)}>
      {children}
    </div>
  );
};
