import { cn } from '@/utils/cn';
import { Button } from './Button';
import { FormErrorMessage } from './FormErrorMessage';
import { FormProps } from '@/types';

/**
 * Custom form component to use on all forms
 * @param onSubmit - submit function to set/sent data
 * @param handleClick - function that can be used on button 2 when onClick is needed
 * @param message - text for setting to the error message component
 * @param button1 - only use this when button 1 is needed, and when the onClick is needed
 * @param button2 - only use this when button 2 is needed
 * @returns
 */
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
