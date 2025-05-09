import Link from 'next/link';
import { ActionDropdownItemProps } from '@/types';

export const ActionDropdownItem = ({ text, url }: ActionDropdownItemProps) => {
  return (
    <>
      <Link href={url} className='link' title={text} aria-label={text}>
        {text}
      </Link>
      <div className='h-0.5 rounded-lg w-full bg-blue-grey last-of-type:hidden' />
    </>
  );
};
