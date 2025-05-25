import { ReactNode } from 'react';

type HeadingTags = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
interface HeadingProps {
  as?: HeadingTags;
  className?: string;
  children: ReactNode;
}

export const Heading = ({ as = 'h1', className, children }: HeadingProps) => {
  const Tag = as;
  return <Tag className={className}>{children}</Tag>;
};
