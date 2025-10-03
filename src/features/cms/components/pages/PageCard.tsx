import Image from 'next/image';
import Link from 'next/link';
import { Heading } from '@/components/ui';
import { Page } from '@/features/cms/types';
import { getTypeLabel } from '@/features/cms/utils';

export const PageCard = ({ page, index }: { page: Page; index: number }) => {
  return (
    <div className='flex self-stretch'>
      <div className='flex flex-col items-center justify-between gap-2.5 bg-background rounded-lg p-2.5 lg:p-5'>
        <Heading as='h2'>{page.title}</Heading>
        {page.bannerType === 'image' && page.bannerImage ? (
          <Image
            src={page.bannerImage.secure_url}
            alt={page.bannerImage.public_id}
            width={500}
            height={500}
            priority={index === 0}
            className='w-full h-full object-cover rounded-lg'
            unoptimized
          />
        ) : (
          <Image
            src={`/images/PML_Logo.png`}
            alt={'Fallback image'}
            width={500}
            height={500}
            priority={index === 0}
            unoptimized
          />
        )}
        <Link
          href={`/${page.type}/${page.slug}`}
          className='btn-submit py-2 px-4 rounded w-fit mx-auto uppercase mt-2.5'
        >
          {`Read ${getTypeLabel(page.type)}`}
        </Link>
      </div>
    </div>
  );
};
