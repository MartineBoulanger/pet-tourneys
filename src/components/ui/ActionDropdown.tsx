import Link from 'next/link';
import { Fragment } from 'react';
import { Links } from '@/lib/types';

interface ActionDropdownProps {
  links: Links;
}

export const ActionDropdown = ({ links }: ActionDropdownProps) => {
  if (!links) return null;

  return (
    <div className='flex flex-col gap-2.5'>
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
          <div className='h-0.5 rounded-lg w-full bg-blue-grey last-of-type:hidden' />
        </Fragment>
      ))}
    </div>
  );
};
