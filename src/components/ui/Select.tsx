'use client';

import { SelectProps } from '@/types';
import { cn } from '@/utils/cn';

export const Select = ({
  label,
  id,
  name,
  required = false,
  className,
  children,
  ...props
}: SelectProps) => {
  return (
    <div>
      <label htmlFor={id}>{label}:</label>
      <select
        id={id}
        name={name}
        className={cn(
          'block w-full p-2 border rounded-md text-background bg-foreground mt-0.5',
          className
        )}
        required={required}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};
