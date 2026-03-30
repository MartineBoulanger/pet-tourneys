import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export const Container = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={cn(
        'max-w-screen-2xl mx-auto my-5 px-5 lg:px-2.5 relative',
        className,
      )}
    >
      {children}
    </div>
  );
};
