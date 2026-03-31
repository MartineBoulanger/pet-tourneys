'use client';

import { TextareaProps } from '@/types/components.types';
import { cn } from '@/utils/cn';

export const Textarea = ({
  label,
  id,
  name,
  rows,
  required = false,
  className,
  ...props
}: TextareaProps) => {
  return (
    <div>
      <label htmlFor={id}>{label}:</label>
      <textarea
        id={id}
        name={name}
        required={required}
        rows={rows}
        className={cn(
          'block w-full p-2 border rounded-md text-background bg-foreground mt-0.5 ring-humanoid focus:ring-2 focus:ring-humanoid focus:outline-none',
          className,
        )}
        {...props}
      />
    </div>
  );
};
