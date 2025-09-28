import { HTMLProps } from 'react';
import { cn } from '@/utils/cn';
import { Button } from './Button';
import { FormErrorMessage } from './FormErrorMessage';

export interface FormProps extends HTMLProps<HTMLFormElement> {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  button1?: {
    variant?: 'secondary' | 'link' | 'primary' | undefined;
    type?: 'button' | 'submit' | 'reset' | undefined;
    text?: string;
  };
  button2?: {
    variant?: 'secondary' | 'link' | 'primary' | undefined;
    type?: 'button' | 'submit' | 'reset' | undefined;
    text?: string;
  };
  handleClick?: () => void; // if a onClick is needed, use the button2 prop, only this button has the onClick set
  message?: string;
}

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
        'p-2.5 lg:p-5 bg-background rounded-lg flex flex-col w-full gap-2.5',
        className
      )}
    >
      {children}
      {button1 || button2 ? (
        <div className='flex gap-2.5 self-end mt-2.5'>
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
