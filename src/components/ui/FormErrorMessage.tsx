import { FormErrorMessageProps } from '@/types';
import { Paragraph } from './Paragraph';

export const FormErrorMessage = ({ message }: FormErrorMessageProps) => {
  return message ? (
    <Paragraph className='text-red text-sm mt-1'>{message}</Paragraph>
  ) : null;
};
