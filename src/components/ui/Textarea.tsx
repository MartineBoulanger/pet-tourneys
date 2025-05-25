'use client';

import { DetailedHTMLProps, TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface TextareaProps
  extends Omit<
    DetailedHTMLProps<
      TextareaHTMLAttributes<HTMLTextAreaElement>,
      HTMLTextAreaElement
    >,
    'required' | 'rows'
  > {
  label: string;
  id: string;
  name: string;
  rows: number;
  required?: boolean;
}

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
