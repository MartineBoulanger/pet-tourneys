import { IoMdImages } from 'react-icons/io';
import { Resource as ResourceType } from '@/types/supabase.types';
import { Heading, Paragraph } from '@/components/ui';
import { ImageGrid } from '@/components/layout/ImageGrid';

export function ResourceSection({ resource }: { resource: ResourceType }) {
  // Ensure images is always an array
  const images = Array.isArray(resource.images) ? resource.images : [];

  return (
    <section className='space-y-2.5 lg:space-y-5'>
      {/* Section header */}
      <div className='text-center bg-background rounded-lg p-2.5 lg:p-5'>
        <Heading as='h2' className='mb-2.5 mx-auto text-foreground/90'>
          {resource.title}
        </Heading>
        <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
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
