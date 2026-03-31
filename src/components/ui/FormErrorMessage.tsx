import { Paragraph } from './Paragraph';

export const FormErrorMessage = ({
  message,
}: {
  message?: string | undefined | null;
}) => {
  return message ? (
    <Paragraph className='text-red text-sm mt-1'>{message}</Paragraph>
  ) : null;
};
