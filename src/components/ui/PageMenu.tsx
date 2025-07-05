import Link from 'next/link';
import { Fragment } from 'react';
import { Links } from '@/lib/types';
import { cn } from '@/utils/cn';

interface ActionDropdownProps {
  links: Links;
  className?: string;
}

export const PageMenu = ({ links, className }: ActionDropdownProps) => {
  if (!links) return null;

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-center gap-2.5 p-2.5 rounded-lg bg-background',
        className
      )}
    >
      {links
        .filter((l) => l.url !== '')
        .map((link) => (
          <Fragment key={link.id}>
            <Link
              href={link.url}
              className='link'
              title={link.text}
              aria-label={link.text}
            >
              {link.text}
            </Link>
            <div className='w-1 h-1 rounded-full bg-foreground last-of-type:hidden' />
          </Fragment>
        ))}
    </div>
  );
};
