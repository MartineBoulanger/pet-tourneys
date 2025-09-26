import Image from 'next/image';
import Link from 'next/link';
import { Heading } from '@/components/ui';
import { PageCardProps } from '../types';

export const PageCard = ({ page }: PageCardProps) => {
  const pageParent =
    page.pageType === 'Article'
      ? 'articles'
      : page.pageType === 'Guide'
      ? 'guides'
      : 'pet-reviews';

  return (
    <div className='bg-light-grey shadow-md rounded-lg p-2.5 flex self-stretch'>
      <div className='flex flex-col items-center justify-between gap-5 bg-background rounded-lg p-2.5 lg:p-5'>
        <Heading as='h2'>{page.pageTitle}</Heading>
        {page.banner && page?.banner?.bannerPicture ? (
          <Image
            src={page?.banner?.bannerPicture?.url || ''}
            alt={page?.banner?.bannerPicture?.title || ''}
            width={500}
            height={500}
          />
        ) : (
          <Image
            src={`/images/PML_Logo.png`}
            alt={'Fallback image'}
            width={500}
            height={500}
            unoptimized
          />
        )}
        <Link
          href={`/${pageParent}/${page.urlSlug}`}
          className='btn-submit py-2 px-4 rounded w-fit mx-auto uppercase'
        >
          {`Read ${page.pageType}`}
        </Link>
      </div>
    </div>
  );
};
