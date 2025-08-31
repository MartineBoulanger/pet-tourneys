import { Prize as PrizeType } from '@/features/cms/types';
import { ImageRecord } from '@/features/image-server/types';
import { cn } from '@/utils/cn';
import { Divider } from '@/components/ui';
import { ImageGrid } from '../ImageGrid';
import Carousel from '../Carousel';

export function ImageSection({
  prize,
}: {
  prize: PrizeType & { images: ImageRecord[] };
}) {
  if (prize.images.length === 0) return null;

  const colNumber =
    prize.isColumnLayout && prize.images.length > 1
      ? 2
      : prize.images.length === 1
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
      {prize.images.length > 2 && prize.isCarousel ? (
        <div className='text-center'>
          <Carousel
            images={prize.images}
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
        <ImageGrid images={prize.images} cols={colNumber} />
      )}
    </div>
  );
}
