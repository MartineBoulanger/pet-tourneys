import { FormErrorMessageProps } from '@/types';

export const FormErrorMessage = ({ message }: FormErrorMessageProps) => {
  return message ? (
    <div className='text-red text-sm mt-1'>{message}</div>
  ) : null;
};
