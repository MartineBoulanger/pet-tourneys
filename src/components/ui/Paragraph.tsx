import { ReactNode } from 'react';

export const Paragraph = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return <p className={className}>{children}</p>;
};
