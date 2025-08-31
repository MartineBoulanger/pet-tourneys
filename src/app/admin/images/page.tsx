import { listImages } from '@/features/image-server/actions/getImages';
import { ImagesManager } from '@/features/image-server/components/ImagesManager';
import { Container, Heading, Divider, Paragraph } from '@/components/ui';

export default async function ImagesPage() {
  const result = await listImages();
  const images = result?.items || result || [];

  return (
    <>
      <Divider alignment='horizontal' color='light-grey' height='0.5' />
      <Container className='px-0 lg:px-0'>
        <Heading as='h2' className='font-sans tracking-normal text-xl mb-2.5'>
          {'Manage All Images'}
        </Heading>
        <Paragraph className='text-humanoid'>
          {'Upload, organize, and manage all images'}
        </Paragraph>
        <ImagesManager initialImages={images} />
      </Container>
    </>
  );
}
