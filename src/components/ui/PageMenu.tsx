import Link from 'next/link';
import { Fragment } from 'react';
import { Links } from '@/lib/types';

interface ActionDropdownProps {
  links: Links;
}

export const PageMenu = ({ links }: ActionDropdownProps) => {
  if (!links) return null;

  return (
    <div className='flex flex-wrap items-center justify-center gap-2.5 p-2.5 rounded-lg bg-background'>
      {links.map((link) => (
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
