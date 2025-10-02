import Image from 'next/image';
import { cn } from '@/utils/cn';
import { CloudinaryImage } from '@/features/cloudinary/types';
import { Video } from '@/features/cms/components/Video';

type BannerProps = {
  bannerType: 'image' | 'video' | 'none';
  title: string;
  bannerImage?: CloudinaryImage | null;
  bannerUrl?: string;
  className?: string;
};

export function Banner({
  bannerType,
  title,
  bannerImage,
  bannerUrl,
  className = '',
}: BannerProps) {
  if (bannerType === 'none' || !title) return null;

  return bannerType === 'image' && bannerImage ? (
    <div
      className={cn(
        'flex items-center justify-center w-full h-full lg:h-[85vh] relative px-2.5',
        className
      )}
    >
      <Image
        src={bannerImage.secure_url}
        alt={bannerImage.public_id}
        width={bannerImage.width}
        height={bannerImage.height}
        className='h-full w-full object-contain'
        loading='eager'
        unoptimized
      />
    </div>
  ) : bannerType === 'video' && bannerUrl ? (
    <Video url={bannerUrl} title={title} autoplay controls mute showinfo />
  ) : null;
}
