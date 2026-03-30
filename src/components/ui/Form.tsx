import { cn } from '@/utils/cn';
import { Button } from './Button';
import { FormErrorMessage } from './FormErrorMessage';
import { FormProps } from '@/types/components.types';

export const Form = ({
  handleSubmit,
  button1,
  button2,
  handleClick,
  message,
  className,
  btnClassName,
  children,
}: FormProps) => {
  return (
    <form
      onSubmit={handleSubmit}
      className={cn('bg-background rounded-lg flex flex-col w-full', className)}
    >
      <div className='p-2.5 lg:p-5'>{children}</div>
      {button1 || button2 ? (
        <div
          className={cn(
            'flex items-center justify-center lg:justify-end gap-2.5 p-2.5 lg:p-5 w-full',
            btnClassName,
          )}
        >
          {button1 && (
            <Button
              variant={button1.variant}
              title={button1.text}
              aria-label={button1.text}
              type={button1.type}
              onClick={handleClick}
            >
              {button1.text}
            </Button>
          )}
          {button2 && (
            <Button
              title={button2.text}
              aria-label={button2.text}
              variant={button2.variant}
              type={button2.type}
            >
              {button2.text}
            </Button>
          )}
        </div>
      ) : null}
      <FormErrorMessage message={message} />
    </form>
  );
};
