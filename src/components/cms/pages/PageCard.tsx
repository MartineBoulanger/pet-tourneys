import Image from 'next/image';
import Link from 'next/link';
import { Heading } from '@/components/ui';
import { Page } from '@/types/supabase.types';
import { getPageTypeLabel } from '@/utils/supabase/getPageTypeLabel';

export const PageCard = ({ page, index }: { page: Page; index: number }) => {
  return (
    <div className='flex self-stretch'>
      <div className='flex flex-col items-center justify-between gap-2.5 bg-background rounded-lg p-2.5 lg:p-5'>
        <Heading as='h2' className='text-foreground/90'>
          {page.title}
        </Heading>
        {page.bannerimage ? (
          <Image
            src={page.bannerimage.secure_url}
            alt={page.bannerimage.public_id}
            priority={index === 0}
            className='w-full h-full object-contain rounded-lg overflow-hidden aspect-auto'
            style={{
              maxHeight: 'calc(90vh - 350px)',
              width: 'auto',
              height: 'auto',
              marginInline: 'auto',
            }}
            width={page.bannerimage.width}
            height={page.bannerimage.height}
          />
        ) : (
          <Image
            src='/PML_Logo.png'
            alt='PML logo'
            className='w-full h-full object-contain rounded-lg overflow-hidden aspect-auto'
            style={{
              maxHeight: 'calc(90vh - 350px)',
              width: 'auto',
              height: 'auto',
              marginInline: 'auto',
            }}
            width={500}
            height={500}
            priority={index === 0}
          />
        )}
        <Link
          href={`/${page.type}/${page.slug}`}
          className='btn-submit py-2 px-4 rounded w-fit mx-auto uppercase mt-2.5'
        >
          {`Read ${getPageTypeLabel(page.type)}`}
        </Link>
      </div>
    </div>
  );
};
