import { ImagesManager } from '@/features/cloudinary/components/Manager';
import { getImagesAction } from '@/features/cloudinary/actions/cloudinary';
import { Container, Heading, Divider, Paragraph } from '@/components/ui';

export default async function ImagesPage() {
  const { success, data, nextCursor, error } = await getImagesAction(
    'pml-images',
    undefined,
    20
  );

  if (error) return <Paragraph>{error}</Paragraph>;

  return (
    <>
      <Divider alignment='horizontal' color='light-grey' height='0.5' />
      <Container className='px-0 lg:px-0 my-0'>
        <Heading as='h2' className='text-foreground/80 mb-5'>
          {'Manage All Images'}
        </Heading>
        <Paragraph className='text-humanoid text-center mb-2.5'>
          {'Upload, organize, and manage all images'}
        </Paragraph>
        <ImagesManager
          folder='pml-images'
          initImages={success ? data : []}
          nextCursor={nextCursor}
          path='/admin/images'
        />
      </Container>
    </>
  );
}
