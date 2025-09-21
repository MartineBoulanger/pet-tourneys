import { AdminImagesManager } from '@/features/cloudinary/components/Management';
import { Container, Heading, Divider, Paragraph } from '@/components/ui';

export default async function PetImagesPage() {
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
        <AdminImagesManager folder='pml-pet-images' />
      </Container>
    </>
  );
}
