import { Cloudinary } from '@/components/cloudinary/Cloudinary';
import { getMultipleImages } from '@/actions/cloudinary/getImages';
import { Container, Heading, Paragraph } from '@/components/ui';

export default async function ImagesPage() {
  const { success, data, nextCursor, error } = await getMultipleImages(
    'pml-images',
    undefined,
    20,
  );

  if (error) return <Paragraph>{error}</Paragraph>;

  return (
    <Container className='px-0 lg:px-0 my-0'>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <Heading as='h2' className='mb-5 font-brutals-normal mx-auto'>
        {'Manage All Images'}
      </Heading>
      <Paragraph className='text-foreground/50 text-center mb-2.5'>
        {'Upload, organize, and manage all images'}
      </Paragraph>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <Cloudinary
        folder='pml-images'
        initImages={success ? data : []}
        nextCursor={nextCursor}
        path='/admin-panel/images'
      />
    </Container>
  );
}
