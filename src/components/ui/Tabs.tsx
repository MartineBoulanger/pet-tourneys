import { cn } from '@/utils/cn';
import { ComponentPropsWithoutRef, forwardRef } from 'react';

export interface TabsProps extends ComponentPropsWithoutRef<'div'> {
  variant?: 'default' | 'pills';
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2.5 p-2.5 rounded-lg',
          variant === 'default' ? 'bg-muted' : '',
          className
        )}
        role='tablist'
        {...props}
      >
        {children}
      </div>
    );
  }
);

Tabs.displayName = 'Tabs';
