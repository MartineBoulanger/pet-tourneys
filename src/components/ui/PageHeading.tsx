import { HTMLProps, JSX } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { cn } from '@/utils/cn';
import { PopUp } from './PopUp';
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
      className={cn(
        'flex flex-col md:flex-row flex-wrap items-start md:items-center justify-center md:justify-between mb-10 lg:mb-0',
        className
      )}
    >
      <Heading>{heading}</Heading>
      {children ? (
        <PopUp
          text={
            <span className='flex gap-2'>
              {'Go To'} <FaChevronDown />
            </span>
          }
          divClassName='w-[250px] lg:right-0'
        >
          {children}
        </PopUp>
      ) : null}
    </div>
  );
};
