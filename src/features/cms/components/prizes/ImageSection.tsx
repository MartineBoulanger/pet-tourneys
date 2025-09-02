import { Prize as PrizeType } from '@/features/cms/types';
import { cn } from '@/utils/cn';
import { Divider } from '@/components/ui';
import { ImageGrid } from '../ImageGrid';
import Carousel from '../Carousel';

export function ImageSection({ prize }: { prize: PrizeType }) {
  if (prize.images?.length === 0) return null;

  // Ensure images is always an array
  const images = Array.isArray(prize.images) ? prize.images : [];

  const colNumber =
    prize.isColumnLayout && prize.images && prize.images?.length > 1
      ? 2
      : prize.images?.length === 1
      ? 1
      : 0;

  return (
    <div className={cn(!prize.isColumnLayout && 'mt-2.5 lg:mt-5')}>
      {!prize.isColumnLayout && (
        <Divider
          alignment='horizontal'
          color='humanoid'
          width='24'
          height='1'
        />
      )}
      {images.length > 2 && prize.isCarousel ? (
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
