import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface ContainerProps {
  className?: string;
  children: ReactNode;
}

export const Container = ({ className, children }: ContainerProps) => {
  return (
    <div
      className={cn(
        'max-w-screen-2xl mx-auto my-5 sm:my-10 relative',
        className
      )}
    >
      {children}
    </div>
  );
};
