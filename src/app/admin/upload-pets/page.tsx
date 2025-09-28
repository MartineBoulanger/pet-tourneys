import { Container, Heading, Divider } from '@/components/ui';
import { PetsDataConverter } from '@/features/supabase/components/admin/PetsDataConvertor';

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
      <Container className='px-0 lg:px-0 my-0'>
        <Heading as='h2' className='text-foreground/80 mb-5'>
          {'Pets Data Convertor Form'}
        </Heading>
        <PetsDataConverter />
      </Container>
    </>
  );
}
