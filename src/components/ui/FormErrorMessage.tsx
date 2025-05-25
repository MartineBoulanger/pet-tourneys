import { Paragraph } from './Paragraph';

interface FormErrorMessageProps {
  message?: string | undefined | null;
}

export const FormErrorMessage = ({ message }: FormErrorMessageProps) => {
  return message ? (
    <Paragraph className='text-red text-sm mt-1'>{message}</Paragraph>
  ) : null;
};
