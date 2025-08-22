import { Container, Heading, Divider } from '@/components/ui';
import { PetsDataConverter } from '@/components/admin/PetsDataConvertor';

export async function generateMetadata() {
  return {
    title: 'Upload Pets Data',
    robots: { index: false, follow: false },
  };
}

export default async function UploadPetsPage() {
  return (
    <>
      <Divider alignment='horizontal' color='light-grey' height='0.5' />
      <Container className='max-w-[1024px]'>
        <Heading
          as='h2'
          className='font-sans tracking-normal text-xl text-center mb-2.5'
        >
          {'Pets Data Convertor Form'}
        </Heading>
        <PetsDataConverter />
      </Container>
    </>
  );
}
