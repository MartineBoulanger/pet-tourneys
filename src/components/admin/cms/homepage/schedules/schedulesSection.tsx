import Image from 'next/image';
import { FaImage } from 'react-icons/fa';
import { ImageUpload } from '@/mongoDB/types';
import { Heading, Divider, Paragraph } from '@/components/ui';
import { cn } from '@/utils/cn';

interface SchedulesSectionProps {
  schedule: {
    _id: string;
    title: string;
    layout: '2' | '3' | '4';
    description?: string;
    isVisible: boolean;
    createdAt: Date;
    updatedAt: Date;
    images: Array<{
      imageId: string;
      imageName: string;
      imageDate: string;
      order?: number;
      imageData: ImageUpload | null;
    }>;
  };
}

export function ScheduleSection({ schedule }: SchedulesSectionProps) {
  if (!schedule.isVisible) return null;

  const getGridCols = (layout: string) => {
    switch (layout) {
      case '2':
        return 'grid-cols-1 md:grid-cols-2';
      case '3':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case '4':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  // Sort images by order
  const sortedImages = schedule.images.sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  return (
    <div className='bg-background rounded-lg shadow-md p-2.5 lg:p-5'>
      <Heading
        as='h2'
        className='text-2xl lg:text-3xl font-bold font-sans tracking-normal text-center'
      >
        {schedule.title}
      </Heading>
      <Divider alignment='horizontal' color='humanoid' width='24' height='1' />

      <div
        className={cn('grid gap-2.5 lg:gap-5', getGridCols(schedule.layout))}
      >
        {sortedImages.map((item, index) => (
          <div
            key={`${item.imageId}-${index}`}
            className='group block relative overflow-hidden rounded-lg bg-light-grey'
          >
            {item.imageData ? (
              <div className='relative flex flex-col aspect-video overflow-hidden'>
                <div className='max-h-[350px] max-w-full mx-auto'>
                  <Image
                    src={item.imageData.src}
                    alt={item.imageData.alt || item.imageName}
                    className='w-full h-full object-contain'
                    width={item.imageData.width}
                    height={item.imageData.height}
                  />
                </div>
              </div>
            ) : (
              <div className='aspect-video flex items-center justify-center'>
                <div className='text-center text-foreground'>
                  <div className='w-12 h-12 mx-auto mb-2.5 text-humanoid rounded-lg flex items-center justify-center'>
                    <FaImage className='w-12 h-12' />
                  </div>
                  <Paragraph className='text-sm'>{'No Image'}</Paragraph>
                </div>
              </div>
            )}

            {/* Title overlay */}
            <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90  to-transparent p-2.5'>
              <Heading as='h3' className='text-foreground font-bold text-2xl'>
                {item.imageName}
              </Heading>
              <Paragraph className='text-humanoid font-semibold text-sm'>
                {item.imageDate}
              </Paragraph>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
