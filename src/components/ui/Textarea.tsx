'use client';

import { cn } from '@/utils/cn';
import { TextareaProps } from '@/types';

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
          'block w-full p-2 border rounded-md text-background bg-foreground mt-0.5',
          className
        )}
        {...props}
      />
    </div>
  );
};
