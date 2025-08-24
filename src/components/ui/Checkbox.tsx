'use client';

import { DetailedHTMLProps, InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface CheckboxProps
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'required'
  > {
  label?: string;
  id: string;
  name: string;
  required?: boolean;
}

export const Checkbox = ({
  label,
  id,
  name,
  required = false,
  className,
  ...props
}: CheckboxProps) => {
  return (
    <label className='flex items-center gap-2.5'>
      <input
        id={id}
        type='checkbox'
        name={name}
        required={required}
        className={cn('block border rounded-lg bg-foreground', className)}
        {...props}
      />
      {label ? label : null}
    </label>
  );
};
