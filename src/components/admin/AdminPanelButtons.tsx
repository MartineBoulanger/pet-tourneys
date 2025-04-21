import Link from 'next/link';
import Image from 'next/image';
import { adminData } from '@/lib/adminData';
import { Heading } from '@/components/ui';

export const AdminPanelButtons = ({
  isMatchesPage = false,
}: {
  isMatchesPage?: boolean;
}) => {
  return (
    <div className='mb-10'>
      <Heading as='h2' className='text-xl mb-2'>
        {'What do you want to do?'}
      </Heading>
      <div className='flex items-center gap-5'>
        {adminData.map(({ linkText, imageSrc, id, url }) => (
          <Link
            className='btn-link flex items-center gap-2 border py-1 px-3 rounded-lg border-blue-grey hover:bg-blue-grey hover:text-foreground'
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
              />
            </span>
            <span>{linkText}</span>
          </Link>
        ))}
        {isMatchesPage ? (
          <Link
            href='/admin'
            className='btn-link flex items-center gap-2 border py-1 px-3 rounded-lg border-blue-grey hover:bg-blue-grey hover:text-foreground'
            title='Back To Tournaments List'
            aria-label='Back To Tournaments List'
          >
            <span className='max-w-[40px] max-h-[40px]'>
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_URL!}/images/redrex.png`}
                alt={'Back To Tournaments List'}
                width={50}
                height={50}
                className='w-full h-full object-cover'
              />
            </span>
            <span>{'Back To Tournaments List'}</span>
          </Link>
        ) : null}
      </div>
    </div>
  );
};
