import { Container, Heading, Paragraph } from '@/components/ui';
import { PetsDataConverter } from '@/components/admin';

export async function generateMetadata() {
  return {
    title: 'Upload Pets Data',
    robots: { index: false, follow: false },
  };
}

export default async function UploadPetsPage() {
  return (
    <Container className='max-w-[1024px]'>
      <Heading className='text-center'>{'Pets Data Convertor'}</Heading>
      <Paragraph className='max-w-[600px] text-center mx-auto mb-5 mt-2.5 text-sm'>
        {
          "Upload the excel file sheet from Xu-Fu's pet guide, and convert it to a JSON file, then download the json file, and make sure you move the file from Downloads folder to the lib folder in the app."
        }
      </Paragraph>
      <PetsDataConverter />
    </Container>
  );
}
