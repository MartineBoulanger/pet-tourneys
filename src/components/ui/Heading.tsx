import { HeadingProps } from '@/types/components.types';

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
