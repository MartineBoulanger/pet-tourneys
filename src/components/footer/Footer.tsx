import Link from 'next/link';
import { FiExternalLink } from 'react-icons/fi';
import { FaRegCopyright } from 'react-icons/fa';
import { footerData, socialsData } from '@/lib/navigationData';

export const Footer = async () => {
  return (
    <footer className='w-full bg-background p-5 pt-10 mb-13 lg:mb-0'>
      <div className='flex flex-row items-center justify-center gap-5 max-w-screen-2xl mx-auto mb-5'>
        {socialsData?.map(({ id, url, Icon, name }) => (
          <Link
            title={name}
            aria-label={name}
            key={id}
            className='btn-link md:px-2.5'
            href={url}
            target='_blank'
          >
            <Icon className='w-6 h-6' />
          </Link>
        ))}
      </div>
      <div className='flex flex-col lg:flex-row items-center justify-evenly max-w-screen-2xl mx-auto bg-light-grey rounded-lg py-2.5'>
        {footerData?.map(({ id, url, Icon, name }) => (
          <Link
            title={name}
            aria-label={name}
            key={id}
            className='btn-link p-2.5 lg:p-5 flex items-center gap-1'
            href={url}
            target='_blank'
          >
            <Icon /> <span>{name}</span> <FiExternalLink />
          </Link>
        ))}
      </div>
      <div className='pt-5 flex items-center justify-center text-sm text-foreground/50'>
        <FaRegCopyright className='w-2.5 h-2.5 self-start' />
        <span className='mr-1'>{new Date().getFullYear()}</span>
        <span>{'- Pet Masters League'}</span>
        <Link
          href='/privacy-policy'
          className='btn-link text-light-blue italic underline ml-2.5 text-xs'
        >
          {'privacy-policy'}
        </Link>
      </div>
    </footer>
  );
};
