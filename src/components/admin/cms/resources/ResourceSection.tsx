import { IoMdImages } from 'react-icons/io';
import { ImageUpload, Resource as ResourceType } from '@/mongoDB/types';
import { ImageGrid } from '../ImageGrid';
import { Heading, Paragraph, Divider } from '@/components/ui';

interface ResourceSectionProps {
  resource: ResourceType & { images: ImageUpload[] };
}

export function ResourceSection({ resource }: ResourceSectionProps) {
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
          {resource.images.length}
          {' image'}
          {resource.images.length !== 1 ? 's' : ''}
        </Paragraph>
        {/* Images grid */}
        {resource.images.length === 0 ? (
          <div className='flex flex-col items-center text-center py-12'>
            <IoMdImages className='w-16 h-16 text-foreground/60 mb-5' />
            <Paragraph className='text-foreground/30'>
              {'No images available in this resource section'}
            </Paragraph>
          </div>
        ) : (
          <ImageGrid images={resource.images} />
        )}
      </div>
    </section>
  );
}
