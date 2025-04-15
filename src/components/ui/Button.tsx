import { cn } from '@/utils/cn';
import { ButtonProps } from '@/types';

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
