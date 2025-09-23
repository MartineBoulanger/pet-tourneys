import { ImagesManager } from '@/features/cloudinary/components/Manager';
import { getImagesAction } from '@/features/cloudinary/actions/cloudinary';
import { Container, Heading, Divider, Paragraph } from '@/components/ui';

export default async function PetImagesPage() {
  const images = await getImagesAction('pml-pet-images');

  return (
    <>
      <Divider alignment='horizontal' color='light-grey' height='0.5' />
      <Container className='px-0 lg:px-0'>
        <Heading as='h2' className='font-sans tracking-normal text-xl mb-2.5'>
          {'Manage All Pet Images'}
        </Heading>
        <Paragraph className='text-humanoid'>
          {'Upload, organize, and manage all pet images'}
        </Paragraph>
        <ImagesManager
          folder='pml-pet-images'
          initImages={images.success ? images.data : []}
          path='/admin/upload-pets/images'
        />
      </Container>
    </>
  );
}
