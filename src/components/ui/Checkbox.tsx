'use client';

import { CheckboxProps } from '@/types/components.types';
import { cn } from '@/utils/cn';

export const Checkbox = ({
  label,
  id,
  name,
  required = false,
  className,
  ...props
}: CheckboxProps) => {
  return (
    <label className='flex items-center gap-2.5 cursor-pointer'>
      <input
        id={id}
        type='checkbox'
        name={name}
        required={required}
        className={cn(
          'block border rounded-lg bg-foreground cursor-pointer ring-humanoid focus:ring-1 focus:ring-humanoid focus:outline-none accent-humanoid',
          className,
        )}
        {...props}
      />
      {label ? label : null}
    </label>
  );
};
