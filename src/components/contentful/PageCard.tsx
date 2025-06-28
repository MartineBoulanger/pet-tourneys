import Image from 'next/image';
import Link from 'next/link';
import { Heading } from '@/components/ui';
import { PageCardProps } from './types';

export const PageCard = ({ page }: PageCardProps) => {
  return (
    <div className='bg-light-grey shadow-md rounded-lg p-2.5 lg:p-5'>
      <div className='flex flex-col items-center justify-between gap-5 bg-background rounded-lg p-2.5 lg:p-5'>
        <Heading
          as='h2'
          className='text-center text-4xl tracking-wider text-humanoid'
        >
          {page.pageTitle}
        </Heading>
        <Image
          src={
            page?.banner?.bannerImage?.media?.url ||
            `${process.env.NEXT_PUBLIC_BASE_URL!}/images/tourney-logo.png`
          }
          alt={page?.banner?.bannerImage?.media?.title || 'Fallback image'}
          width={500}
          height={500}
        />
        <Link
          href={`/${page.pageType === 'Article' ? 'articles' : 'guides'}/${
            page.urlSlug
          }`}
          className='btn-submit py-2 px-4 rounded w-fit mx-auto text-xl uppercase font-bold'
        >
          {page.pageType === 'Article' ? 'Read Article' : 'View Guide'}
        </Link>
      </div>
    </div>
  );
};
