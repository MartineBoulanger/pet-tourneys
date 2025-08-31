import { IoMdImages } from 'react-icons/io';
import { getResourcesWithImages } from '@/features/cms/actions/resources';
import { Heading, Paragraph } from '@/components/ui';
import { ResourceSection } from './ResourceSection';

export async function ResourcesList() {
  const resourcesWithImages = await getResourcesWithImages();

  if (resourcesWithImages.length === 0) {
    return (
      <div className='bg-light-grey rounded-lg mt-5 p-2.5 lg:p-5'>
        <div className='flex flex-col items-center justify-center text-center px-2.5 lg:px-5 py-20 bg-background rounded-lg'>
          <IoMdImages className='text-humanoid mb-6 w-24 h-24' />
          <Heading
            as='h2'
            className='font-sans tracking-normal text-2xl font-bold mb-5'
          >
            {'No Images Available'}
          </Heading>
          <Paragraph className='text-foreground/50'>
            {
              'There are no images available at this moment, please come back later to check if there are images for you to use.'
            }
          </Paragraph>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-2.5 lg:space-y-5 bg-light-grey rounded-lg p-2.5 lg:p-5'>
      {resourcesWithImages.map((resource) => (
        <ResourceSection key={resource._id} resource={resource} />
      ))}
    </div>
  );
}
