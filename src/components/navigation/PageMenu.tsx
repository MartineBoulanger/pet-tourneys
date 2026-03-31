import Link from 'next/link';
import { Links } from '@/types/navigation-types';

export function PageMenu({ links }: { links: Links }) {
  return (
    <div className='flex flex-wrap items-center justify-center gap-2.5'>
      {links
        .filter((l) => l.url !== '')
        .map((link) => (
          <Link
            key={link.id}
            href={link.url}
            className='btn-submit flex items-center gap-2.5 py-[7px] px-[11px] rounded-lg'
            title={link.text}
            aria-label={link.text}
          >
            {link.text}
          </Link>
        ))}
    </div>
  );
}
