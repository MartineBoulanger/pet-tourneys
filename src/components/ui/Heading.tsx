import { HeadingProps } from '@/types';

export const Heading: React.FC<HeadingProps> = ({
  as = 'h1',
  className,
  children,
}) => {
  const Tag = as;
  return <Tag className={className}>{children}</Tag>;
};
