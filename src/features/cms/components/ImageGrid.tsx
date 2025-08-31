import { ImageRecord } from '@/features/image-server/types';
import { cn } from '@/utils/cn';
import { ImageCard } from './ImageCard';

interface ImageGridProps {
  images: ImageRecord[];
  cols?: number;
  isDownloadable?: boolean;
}

export function ImageGrid({
  images,
  cols = 0,
  isDownloadable = false,
}: ImageGridProps) {
  let colNumber;
  switch (cols) {
    case 1:
      colNumber = 'grid-cols-1';
      break;
    case 2:
      colNumber = 'grid-cols-1 sm:grid-cols-2';
      break;
    case 3:
      colNumber = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
      break;
    default:
      colNumber = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
      break;
  }

  return (
    <div className={cn('grid gap-2.5 lg:gap-5', colNumber)}>
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          isDownloadable={isDownloadable}
        />
      ))}
    </div>
  );
}
