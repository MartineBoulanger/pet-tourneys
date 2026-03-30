import Image from 'next/image';
import { Video } from '@/components/layout/Video';
import { Section } from '@/types/supabase.types';
import { getTextAlignment } from '@/utils/supabase/getTextAlignment';
import { cn } from '@/utils/cn';

export function PageSection({ section }: { section: Section }) {
  const { type, layout, text, textAlign, image, videoUrl } = section;
  const textAlignmentClass = getTextAlignment(textAlign);

  // Full width layout
  if (layout === 'full-width') {
    switch (type) {
      case 'text':
        return (
          text && (
            <div
              className={cn(
                'prose p-2.5 lg:p-5 bg-background rounded-lg',
                textAlignmentClass,
              )}
              dangerouslySetInnerHTML={{ __html: text }}
            />
          )
        );

      case 'image':
        return (
          image && (
            <div className='p-2.5 lg:p-5 bg-background rounded-lg'>
              <Image
                src={image.secure_url}
                alt={image.public_id}
                className='w-full h-full object-contain rounded-lg overflow-hidden aspect-auto'
                style={{
                  maxHeight: 'calc(90vh - 350px)',
                  width: 'auto',
                  height: 'auto',
                  marginInline: 'auto',
                }}
                width={image.width}
                height={image.height}
              />
            </div>
          )
        );

      case 'video':
        return (
          videoUrl && (
            <div className='p-2.5 lg:p-5 bg-background rounded-lg'>
              <Video
                url={videoUrl}
                title={`${type} YouTube Video PML`}
                controls
                showinfo
                modestbranding
              />
            </div>
          )
        );

      case 'text-image':
        return (
          text &&
          image && (
            <div className='p-2.5 lg:p-5 bg-background rounded-lg'>
              <Image
                src={image.secure_url}
                alt={image.public_id}
                className='w-full h-full object-contain rounded-lg overflow-hidden aspect-auto'
                style={{
                  maxHeight: 'calc(90vh - 350px)',
                  width: 'auto',
                  height: 'auto',
                  marginInline: 'auto',
                }}
                width={image.width}
                height={image.height}
              />
              <div className='rounded-full w-40 h-1 my-5 mx-auto bg-humanoid' />
              <div
                className={cn('prose', textAlignmentClass)}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            </div>
          )
        );

      case 'text-video':
        return (
          text &&
          videoUrl && (
            <div className='grid items-center justify-center gap-y-2.5 p-2.5 lg:p-5 bg-background rounded-lg'>
              <Video
                url={videoUrl}
                title={`${type} YouTube Video PML`}
                controls
                showinfo
                modestbranding
              />
              <div className='rounded-full w-40 h-1 my-5 mx-auto bg-humanoid' />
              <div
                className={cn('prose', textAlignmentClass)}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            </div>
          )
        );

      default:
        return null;
    }
  }

  // Two column layout
  if (layout === 'two-column') {
    switch (type) {
      case 'text-image':
        return (
          text &&
          image && (
            <div className='grid lg:grid-cols-3 p-2.5 lg:p-5 bg-background rounded-lg mb-2.5'>
              <div className='lg:col-span-2 flex flex-col lg:flex-row'>
                <Image
                  src={image.secure_url}
                  alt={image.public_id}
                  className='w-full h-full object-contain rounded-lg overflow-hidden aspect-auto'
                  style={{
                    maxHeight: 'calc(90vh - 350px)',
                    width: 'auto',
                    height: 'auto',
                    marginInline: 'auto',
                  }}
                  width={image.width}
                  height={image.height}
                />
                <div className='lg:hidden rounded-full w-40 h-1 my-5 mx-auto bg-humanoid' />
                <div className='hidden lg:block rounded-full h-40 w-1 mx-5 my-auto bg-humanoid' />
              </div>
              <div
                className={cn('prose', textAlignmentClass)}
                dangerouslySetInnerHTML={{ __html: text }}
                style={{
                  maxHeight: 'calc(90vh - 350px)',
                  width: 'auto',
                  height: 'auto',
                }}
              />
            </div>
          )
        );

      case 'text-video':
        return (
          text &&
          videoUrl && (
            <div className='grid lg:grid-cols-3 p-2.5 lg:p-5 bg-background rounded-lg mb-2.5'>
              <div className='lg:col-span-2 flex flex-col lg:flex-row'>
                <Video
                  url={videoUrl}
                  title={`${type} YouTube Video PML`}
                  controls
                  showinfo
                  modestbranding
                />
                <div className='lg:hidden rounded-full w-40 h-1 my-5 mx-auto bg-humanoid' />
                <div className='hidden lg:block rounded-full h-40 w-1 mx-5 my-auto bg-humanoid' />
              </div>
              <div
                className={cn('prose', textAlignmentClass)}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            </div>
          )
        );

      default:
        return null;
    }
  }

  return null;
}
