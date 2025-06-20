import { cn } from '@/utils/cn';
import { ComponentPropsWithoutRef, forwardRef } from 'react';

export interface TabProps extends ComponentPropsWithoutRef<'button'> {
  active?: boolean;
}

export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  ({ active = false, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'px-4 py-2 font-medium text-sm rounded-lg transition-colors border border-background',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          active
            ? 'bg-background text-humanoid shadow-md'
            : 'text-muted-foreground hover:text-foreground hover:bg-background',
          className
        )}
        role='tab'
        aria-selected={active}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Tab.displayName = 'Tab';
