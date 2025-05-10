import Image from 'next/image';
import Link from 'next/link';
import { Heading } from '@/components/ui';
import { PageCardProps } from '@/types';

export const PageCard = ({ page }: PageCardProps) => {
  return (
    <div className='border-2 border-light-grey bg-dark-grey shadow-md rounded-lg flex flex-col items-center justify-between gap-5 p-5'>
      <Heading as='h2' className='text-center text-5xl'>
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
        className='btn-submit py-2 px-4 rounded w-fit mx-auto text-2xl uppercase font-bold'
      >
        {page.pageType === 'Article' ? 'Read Article' : 'View Guide'}
      </Link>
    </div>
  );
};
