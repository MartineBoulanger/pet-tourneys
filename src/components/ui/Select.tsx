'use client';

import { cn } from '@/utils/cn';
import { DetailedHTMLProps, SelectHTMLAttributes } from 'react';

interface SelectProps
  extends Omit<
    DetailedHTMLProps<
      SelectHTMLAttributes<HTMLSelectElement>,
      HTMLSelectElement
    >,
    'required'
  > {
  label: string;
  id: string;
  name: string;
  required?: boolean;
}

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
