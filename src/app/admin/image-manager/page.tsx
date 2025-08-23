import { Container, Heading, Divider, Paragraph } from '@/components/ui';
import { ImageUploader } from '@/components/admin/cms/ImageUploader';

export default async function AdminAllImagesPage() {
  return (
    <Container className='px-0 lg:px-0'>
      <Divider alignment='horizontal' color='light-grey' height='0.5' />
      <Heading as='h2' className='font-sans tracking-normal text-xl mb-2.5'>
        {'Manage All Images'}
      </Heading>
      <Paragraph className='text-humanoid'>
        {'Upload, organize, and manage all images'}
      </Paragraph>
      <ImageUploader />
    </Container>
  );
}
