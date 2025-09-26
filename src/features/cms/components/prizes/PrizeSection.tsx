import { Prize as PrizeType } from '@/features/cms/types';
import { Heading, Divider } from '@/components/ui';
import { cn } from '@/utils/cn';
import { Video } from '../Video';
import { ImageSection } from './ImageSection';

interface PrizeSectionProps {
  prize: PrizeType;
}

export function PrizeSection({ prize }: PrizeSectionProps) {
  const getTextAlignment = (alignment: string) => {
    switch (alignment) {
      case 'left':
        return 'text-left';
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  const textAlignmentClass = getTextAlignment(prize.textAlignment);
  const isImageLeft = prize.imagePosition === 'left';

  return (
    <section className='space-y-2.5 lg:space-y-5'>
      <div className='text-center bg-background rounded-lg p-2.5 lg:p-5'>
        <Heading as='h2' className='mb-2.5 mx-auto text-foreground/90'>
          {prize.title}
        </Heading>
        <Divider
          alignment='horizontal'
          color='humanoid'
          width='24'
          height='1'
        />

        {prize.isColumnLayout ? (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
            {isImageLeft ? (
              <>
                <div className='lg:col-span-2'>
                  <ImageSection prize={prize} />
                </div>
                <div className={cn('lg:col-span-1', textAlignmentClass)}>
                  <div
                    className='prose'
                    dangerouslySetInnerHTML={{ __html: prize.description }}
                  />
                </div>
              </>
            ) : (
              <>
                <div className={cn('lg:col-span-1', textAlignmentClass)}>
                  <div
                    dangerouslySetInnerHTML={{ __html: prize.description }}
                  />
                </div>
                <div className='lg:col-span-2'>
                  <ImageSection prize={prize} />
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            <div
              className={cn('mt-2.5', textAlignmentClass)}
              dangerouslySetInnerHTML={{ __html: prize.description }}
            />
            <ImageSection prize={prize} />
          </>
        )}

        {prize.videoUrl && (
          <>
            <Divider
              alignment='horizontal'
              color='humanoid'
              width='24'
              height='1'
            />
            <Video
              url={prize.videoUrl}
              title={prize.title}
              autoplay
              controls
              mute
            />
          </>
        )}
      </div>
    </section>
  );
}
