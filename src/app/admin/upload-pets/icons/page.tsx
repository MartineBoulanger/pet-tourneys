import { ImagesManager } from '@/features/cloudinary/components/Manager';
import { getImagesAction } from '@/features/cloudinary/actions/cloudinary';
import { Container, Heading, Divider, Paragraph } from '@/components/ui';

export default async function PetIconsPage() {
  const images = await getImagesAction('pml-pet-icons');

  return (
    <>
      <Divider alignment='horizontal' color='light-grey' height='0.5' />
      <Container className='px-0 lg:px-0 my-0'>
        <Heading as='h2' className='text-foreground/80 mb-5'>
          {'Manage All Pet Icons'}
        </Heading>
        <Paragraph className='text-humanoid text-center mb-2.5'>
          {'Upload, organize, and manage all pet icons'}
        </Paragraph>
        <ImagesManager
          folder='pml-pet-icons'
          initImages={images.success ? images.data : []}
          path='/admin/upload-pets/icons'
        />
      </Container>
    </>
  );
}
