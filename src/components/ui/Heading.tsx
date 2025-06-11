import { HTMLProps, ReactNode } from 'react';

type HeadingTags = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
interface HeadingProps extends HTMLProps<HTMLHeadingElement> {
  as?: HeadingTags;
  children: ReactNode;
}

export const Heading = ({
  as = 'h1',
  className,
  children,
  ...rest
}: HeadingProps) => {
  const Tag = as;
  return (
    <Tag className={className} {...rest}>
      {children}
    </Tag>
  );
};
