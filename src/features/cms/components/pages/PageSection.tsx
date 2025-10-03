import Image from 'next/image';
import { Video } from '@/features/cms/components/Video';
import { Section } from '@/features/cms/types';
import { getTextAlignment } from '@/features/cms/utils';
import { cn } from '@/utils/cn';
import { Divider } from '@/components/ui';

interface PageSectionProps {
  section: Section;
}

export function PageSection({ section }: PageSectionProps) {
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
                'prose p-2.5 lg:p-5 bg-background rounded-lg mb-2.5',
                textAlignmentClass
              )}
              dangerouslySetInnerHTML={{ __html: text }}
            />
          )
        );

      case 'image':
        return (
          image && (
            <div className='p-2.5 lg:p-5 bg-background rounded-lg mb-2.5'>
              <Image
                src={image.secure_url}
                alt={image.public_id}
                className='w-full h-full mx-auto object-cover rounded-lg overflow-hidden'
                style={{
                  maxHeight: 'calc(90vh - 350px)',
                  width: 'auto',
                  height: 'auto',
                }}
                width={image.width}
                height={image.height}
                unoptimized
              />
            </div>
          )
        );

      case 'video':
        return (
          videoUrl && (
            <div className='p-2.5 lg:p-5 bg-background rounded-lg mb-2.5'>
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
            <div className='p-2.5 lg:p-5 bg-background rounded-lg mb-2.5'>
              <Image
                src={image.secure_url}
                alt={image.public_id}
                className='w-full h-full mx-auto object-cover rounded-lg overflow-hidden'
                style={{
                  maxHeight: 'calc(90vh - 350px)',
                  width: 'auto',
                  height: 'auto',
                }}
                width={image.width}
                height={image.height}
                unoptimized
              />
              <Divider
                alignment='horizontal'
                height='0.5'
                color='medium-grey'
              />
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
            <div className='grid items-center justify-center gap-y-2.5 p-2.5 lg:p-5 bg-background rounded-lg mb-2.5'>
              <Video
                url={videoUrl}
                title={`${type} YouTube Video PML`}
                controls
                showinfo
                modestbranding
              />
              <Divider
                alignment='horizontal'
                height='0.5'
                color='medium-grey'
              />
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
                  className='w-full h-full mx-auto object-cover rounded-lg overflow-hidden'
                  style={{
                    maxHeight: 'calc(90vh - 350px)',
                    width: 'auto',
                    height: 'auto',
                  }}
                  width={image.width}
                  height={image.height}
                  unoptimized
                />
                <Divider
                  alignment='horizontal'
                  height='0.5'
                  color='medium-grey'
                  className='lg:hidden'
                />
                <Divider
                  alignment='vertical'
                  width='0.5'
                  color='medium-grey'
                  className='hidden lg:block'
                />
              </div>
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
            <div className='grid lg:grid-cols-3 p-2.5 lg:p-5 bg-background rounded-lg mb-2.5'>
              <div className='lg:col-span-2 flex flex-col lg:flex-row'>
                <Video
                  url={videoUrl}
                  title={`${type} YouTube Video PML`}
                  controls
                  showinfo
                  modestbranding
                />
                <Divider
                  alignment='horizontal'
                  height='0.5'
                  color='medium-grey'
                  className='lg:hidden'
                />
                <Divider
                  alignment='vertical'
                  width='0.5'
                  color='medium-grey'
                  className='hidden lg:block'
                />
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
