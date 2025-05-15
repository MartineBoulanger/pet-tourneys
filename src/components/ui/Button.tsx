import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: 'primary' | 'secondary' | 'link';
}

export const Button = ({
  variant = 'primary',
  children,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        variant === 'primary' && 'btn-submit',
        variant === 'secondary' && 'btn-cancel',
        variant === 'link' && 'btn-link',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
