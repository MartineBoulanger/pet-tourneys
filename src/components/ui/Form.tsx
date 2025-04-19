import { cn } from '@/utils/cn';
import { Button } from './Button';
import { FormErrorMessage } from './FormErrorMessage';
import { FormProps } from '@/types';

export const Form = ({
  handleSubmit,
  button1,
  button2,
  handleClick,
  message,
  className,
  children,
}: FormProps) => {
  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'p-5 bg-dark-grey rounded-lg flex flex-col w-full gap-4',
        className
      )}
    >
      {children}
      {button1 || button2 ? (
        <div className='flex gap-5 self-end mt-5'>
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
