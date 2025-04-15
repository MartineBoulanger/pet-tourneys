'use client';

import { cn } from '@/utils/cn';
import { InputProps } from '@/types';

export const Input = ({
  label,
  id,
  name,
  type = 'text',
  required = false,
  className,
  ...props
}: InputProps) => {
  return (
    <div>
      <label htmlFor={id}>{label}:</label>
      <input
        id={id}
        type={type}
        name={name}
        required={required}
        className={cn(
          'block w-full p-2 border rounded-md text-background bg-foreground mt-0.5',
          className
        )}
        {...props}
      />
    </div>
  );
};
