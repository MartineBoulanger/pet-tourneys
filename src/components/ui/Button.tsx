import { ButtonProps } from '@/types/components.types';
import { cn } from '@/utils/cn';

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
        variant === 'inverted' && 'btn-inverted',
        variant === 'link' && 'btn-link',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
