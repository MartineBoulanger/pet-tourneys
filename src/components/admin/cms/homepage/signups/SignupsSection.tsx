import Image from 'next/image';
import Link from 'next/link';
import { FaImage } from 'react-icons/fa';
import { ImageUpload } from '@/mongoDB/types';
import { Heading, Button, Divider, Paragraph } from '@/components/ui';
import { cn } from '@/utils/cn';

interface SignupsSectionProps {
  signup: {
    _id: string;
    title: string;
    layout: '2' | '3' | '4';
    isVisible: boolean;
    createdAt: Date;
    updatedAt: Date;
    images: Array<{
      imageId: string;
      imageName: string;
      imageAlt?: string;
      signupUrl: string;
      order?: number;
      imageData: ImageUpload | null;
    }>;
  };
}

export function SignupSection({ signup }: SignupsSectionProps) {
  if (!signup.isVisible) return null;

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
  const sortedImages = signup.images.sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  return (
    <div className='bg-background rounded-lg shadow-md p-2.5 lg:p-5'>
      <Heading
        as='h2'
        className='text-2xl lg:text-3xl font-bold font-sans tracking-normal text-center'
      >
        {signup.title}
      </Heading>
      <Divider alignment='horizontal' color='humanoid' width='24' height='1' />

      <div className={cn('grid gap-2.5 lg:gap-5', getGridCols(signup.layout))}>
        {sortedImages.map((item, index) => (
          <Link
            key={`${item.imageId}-${index}`}
            href={item.signupUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='group block'
          >
            <div className='relative overflow-hidden rounded-lg transition-all duration-300 bg-light-grey'>
              {item.imageData ? (
                <div className='relative flex flex-col aspect-video overflow-hidden'>
                  <div className='max-h-[350px] max-w-full mx-auto'>
                    <Image
                      src={item.imageData.src}
                      alt={item.imageAlt || item.imageName}
                      className='object-cover transition-transform duration-300 group-hover:scale-105'
                      width={item.imageData.width}
                      height={item.imageData.height}
                    />
                  </div>

                  {/* Overlay with signup button */}
                  <div className='absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-300 flex items-end justify-center p-2.5 lg:p-5'>
                    <Button
                      variant='primary'
                      className='opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                    >
                      {'Sign Up Now'}
                    </Button>
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
              <div className='absolute top-0 left-0 right-0 p-5 text-right bg-gradient-to-b from-background/70  to-transparent'>
                <Heading as='h3' className='text-humanoid font-bold text-2xl'>
                  {item.imageName}
                </Heading>
                <Paragraph className='text-foreground text-sm'>
                  {item.imageAlt}
                </Paragraph>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
