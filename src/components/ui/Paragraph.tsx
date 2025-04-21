import { ParagraphProps } from '@/types';

export const Paragraph = ({ className, children }: ParagraphProps) => {
  return <p className={className}>{children}</p>;
};
