'use client';

import { DetailedHTMLProps, InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface InputProps
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'required' | 'type'
  > {
  label?: string;
  id: string;
  name: string;
  type?:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'date'
    | 'datetime-local'
    | 'url';
  required?: boolean;
}

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
          'block w-full p-2 border rounded-md text-background bg-foreground mt-0.5',
          className
        )}
        {...props}
      />
    </div>
  );
};
