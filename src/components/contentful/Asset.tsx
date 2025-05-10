import Image from 'next/image';
import Link from 'next/link';
import { AssetProps } from '@/types';
import { cn } from '@/utils/cn';

const Asset = ({
  component,
  isBanner = false,
  isPage = false,
  className,
}: AssetProps) => {
  if (!component) return null;

  const { media, cta } = component;
  const { title, url } = media;

  const getSizes = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth > 640 ? 2380 : 640;
      const height = window.innerWidth > 640 ? 1339 : 360;
      return { width, height };
    }
    return { width: 768, height: 432 };
  };

  return (
    <div
      className={cn(
        'w-full h-full',
        isBanner ? 'h-[432px] object-center' : 'relative',
        isPage && isBanner
          ? '-mt-5 md:h-[90vh]'
          : 'md:h-[55vh] rounded-t-lg min-[425px]:rounded-lg overflow-hidden',
        className
      )}
    >
      <Image
        src={url}
        alt={title}
        width={getSizes().width}
        height={getSizes().height}
        className={cn(
          'w-full h-full',
          isPage ? 'object-contain' : 'object-cover'
        )}
        priority={isPage}
      />
      {cta && !isBanner ? (
        <Link
          href={cta.ctaUrl || ''}
          className='btn-submit rounded py-2 px-4 uppercase font-bold absolute right-2 bottom-2'
        >
          {cta.ctaText}
        </Link>
      ) : null}
    </div>
  );
};

export default Asset;
