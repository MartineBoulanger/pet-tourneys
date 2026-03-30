import { Prize as PrizeType } from '@/types/supabase.types';
import { getTextAlignment } from '@/utils/supabase/getTextAlignment';
import { Heading } from '@/components/ui';
import { cn } from '@/utils/cn';
import { Video } from '@/components/layout/Video';
import { ImageSection } from '../resources/ImageSection';

export function PrizeSection({ prize }: { prize: PrizeType }) {
  const textAlignmentClass = getTextAlignment(prize.textalignment);
  const isImageLeft = prize.imageposition === 'left';

  return (
    <section className='space-y-2.5 lg:space-y-5'>
      <div className='text-center bg-background rounded-lg p-2.5 lg:p-5'>
        <Heading as='h2' className='mb-2.5 mx-auto text-foreground/90'>
          {prize.title}
        </Heading>
        <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />

        {prize.iscolumnlayout ? (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
            {isImageLeft ? (
              <>
                <div className='lg:col-span-2'>
                  <ImageSection prize={prize} />
                </div>
                <div className={cn('lg:col-span-1', textAlignmentClass)}>
                  <div
                    className='prose'
                    dangerouslySetInnerHTML={{
                      __html: prize.description || '',
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <div className={cn('lg:col-span-1', textAlignmentClass)}>
                  <div
                    className='prose'
                    dangerouslySetInnerHTML={{
                      __html: prize.description || '',
                    }}
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
              className={cn('mt-2.5 prose', textAlignmentClass)}
              dangerouslySetInnerHTML={{ __html: prize.description || '' }}
            />
            <ImageSection prize={prize} />
          </>
        )}

        {prize.videourl && (
          <>
            <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
            <Video
              url={prize.videourl}
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
