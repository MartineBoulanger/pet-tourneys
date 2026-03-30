'use client';

import { InputProps } from '@/types/components.types';
import { cn } from '@/utils/cn';

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
      {label && <label htmlFor={id}>{label}:</label>}
      <input
        id={id}
        type={type}
        name={name}
        required={required}
        className={cn(
          'block w-full p-2 border rounded-md text-background bg-foreground mt-0.5 ring-humanoid focus:ring-2 focus:ring-humanoid focus:outline-none',
          className,
        )}
        {...props}
      />
    </div>
  );
};
