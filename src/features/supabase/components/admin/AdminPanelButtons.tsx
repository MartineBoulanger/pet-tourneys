import Link from 'next/link';
import Image from 'next/image';
import { adminData } from '@/lib/navigationData';
import { Heading } from '@/components/ui';

interface AdminPanelButtonsProps {
  isMatchesPage?: boolean;
}

export const AdminPanelButtons = ({
  isMatchesPage = false,
}: AdminPanelButtonsProps) => {
  return (
    <div className='mb-5'>
      <Heading
        as='h2'
        className='font-sans tracking-normal text-humanoid text-xl mb-2.5'
      >
        {'What do you want to do?'}
      </Heading>
      <div className='flex flex-wrap items-center gap-2.5 lg:gap-5'>
        {adminData.map(({ linkText, imageSrc, id, url }) => (
          <Link
            className='btn-link flex items-center gap-2.5 border py-1 px-3 rounded-lg border-blue-grey hover:bg-blue-grey hover:text-foreground'
            key={id}
            href={url}
            title={linkText}
            aria-label={linkText}
          >
            <span className='max-w-[40px] max-h-[40px]'>
              <Image
                src={imageSrc}
                alt={linkText}
                width={50}
                height={50}
                className='w-full h-full object-cover'
                loading='lazy'
                unoptimized
              />
            </span>
            <span>{linkText}</span>
          </Link>
        ))}
        {isMatchesPage ? (
          <Link
            href='/admin'
            className='btn-link flex items-center gap-2.5 border py-1 px-3 rounded-lg border-blue-grey hover:bg-blue-grey hover:text-foreground'
            title='Back To League List'
            aria-label='Back To League List'
          >
            <span className='max-w-[40px] max-h-[40px]'>
              <Image
                src={`/images/greenrex.png`}
                alt={'Back To League List'}
                width={50}
                height={50}
                className='w-full h-full object-cover'
                loading='lazy'
                unoptimized
              />
            </span>
            <span>{'Back To League List'}</span>
          </Link>
        ) : null}
      </div>
    </div>
  );
};