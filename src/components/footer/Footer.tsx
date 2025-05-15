import Link from 'next/link';
import { FiExternalLink } from 'react-icons/fi';
import { FaRegCopyright } from 'react-icons/fa';
import { footerData } from '@/lib/navigationData';

export const Footer = async () => {
  return (
    <footer className='w-full bg-background p-5 pt-10 mb-13 md:mb-0'>
      <div className='flex flex-col md:flex-row items-center justify-evenly max-w-screen-2xl mx-auto bg-light-grey rounded-lg'>
        {footerData?.map(({ id, url, Icon, name }) => (
          <Link
            title={name}
            aria-label={name}
            key={id}
            className='btn-link py-5 flex items-center gap-1'
            href={url}
            target='_blank'
          >
            <Icon /> <span>{name}</span> <FiExternalLink />
          </Link>
        ))}
      </div>
      <div className='pt-5 flex items-center justify-center text-sm text-light-blue'>
        <FaRegCopyright />
        {new Date().getFullYear()} {'WoW Pet Community'}
      </div>
    </footer>
  );
};
