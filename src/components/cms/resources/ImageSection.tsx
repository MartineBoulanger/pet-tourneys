import { Prize as PrizeType } from '@/types/supabase.types';
import { cn } from '@/utils/cn';
import { ImageGrid } from '@/components/layout/ImageGrid';
import Carousel from '@/components/layout/Carousel';

export function ImageSection({ prize }: { prize: PrizeType }) {
  if (prize.images?.length === 0) return null;

  // Ensure images is always an array
  const images = Array.isArray(prize.images) ? prize.images : [];

  const colNumber =
    prize.iscolumnlayout && prize.images && prize.images?.length > 1
      ? 2
      : prize.images?.length === 1
        ? 1
        : 0;

  return (
    <div className={cn(!prize.iscolumnlayout && 'mt-2.5 lg:mt-5')}>
      {!prize.iscolumnlayout && (
        <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      )}
      {images.length > 2 && prize.iscarousel ? (
        <div className='text-center'>
          <Carousel
            images={images}
            autoPlay={true}
            autoPlayInterval={5000}
            showThumbnails={true}
            showControls={true}
            aspectRatio='16/9'
            pauseOnHover={true}
            className='w-full max-w-4xl mx-auto'
          />
        </div>
      ) : (
        <ImageGrid images={images} cols={colNumber} />
      )}
    </div>
  );
}
