import { HTMLProps, JSX } from 'react';
import { cn } from '@/utils/cn';
import { Heading } from './Heading';

interface PageHeadingProps extends HTMLProps<HTMLElement> {
  heading: string | JSX.Element | React.ReactNode;
}

export const PageHeading = ({
  heading,
  className,
  children,
}: PageHeadingProps) => {
  if (!heading) return null;

  return (
    <div
      className={cn('flex flex-col flex-wrap w-full mb-5 lg:mb-0', className)}
    >
      {children ? <span className='mb-5 lg:mb-10'>{children}</span> : null}
      <Heading>{heading}</Heading>
    </div>
  );
};
