import { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { TabsProps } from '@/types/components.types';

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2.5 p-2.5 rounded-lg',
          variant === 'default' ? 'bg-muted' : '',
          className,
        )}
        role='tablist'
        {...props}
      >
        {children}
      </div>
    );
  },
);

Tabs.displayName = 'Tabs';
