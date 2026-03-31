import Image from 'next/image';
import { cn } from '@/utils/cn';
import { BannerProps } from '@/types/components.types';

export function Banner({ bannerimage, className = '' }: BannerProps) {
  return bannerimage ? (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 h-full -z-10 inset-0',
        className,
      )}
    >
      <Image
        src={bannerimage.secure_url}
        alt={bannerimage.public_id}
        width={bannerimage.width}
        height={bannerimage.height}
        className='h-full w-full object-cover'
      />
      <div className='absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background' />
    </div>
  ) : null;
}
