import { ReactNode } from 'react';

interface ParagraphProps {
  className?: string;
  children: ReactNode;
}

export const Paragraph = ({ className, children }: ParagraphProps) => {
  return <p className={className}>{children}</p>;
};
