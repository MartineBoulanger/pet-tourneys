import { IoMdImages } from 'react-icons/io';
import { Resource as ResourceType } from '@/features/cms/types';
import { Heading, Paragraph, Divider } from '@/components/ui';
import { ImageGrid } from '../ImageGrid';

interface ResourceSectionProps {
  resource: ResourceType;
}

export function ResourceSection({ resource }: ResourceSectionProps) {
  // Ensure images is always an array
  const images = Array.isArray(resource.images) ? resource.images : [];

  return (
    <section className='space-y-2.5 lg:space-y-5'>
      {/* Section header */}
      <div className='text-center bg-background rounded-lg p-2.5 lg:p-5'>
        <Heading
          as='h2'
          className='text-3xl font-bold font-sans tracking-normal mb-2.5'
        >
          {resource.title}
        </Heading>
        <Divider
          alignment='horizontal'
          color='humanoid'
          width='24'
          height='0.5'
        />
        <Paragraph className='text-foreground/50 my-5'>
          {images.length || 0}
          {' image'}
          {images.length !== 1 ? 's' : ''}
        </Paragraph>
        {/* Images grid */}
        {images.length === 0 ? (
          <div className='flex flex-col items-center text-center py-12'>
            <IoMdImages className='w-16 h-16 text-foreground/60 mb-5' />
            <Paragraph className='text-foreground/30'>
              {'No images available in this resource section'}
            </Paragraph>
          </div>
        ) : (
          <ImageGrid images={images} isDownloadable />
        )}
      </div>
    </section>
  );
}
