import { Container, Heading, Paragraph } from '@/components/ui';
import { PetBulkUpload } from '@/components/admin-panel/pets-management/pets-upload/PetBulkUpload';

export default async function AddBulkPage() {
  return (
    <Container className='px-0 lg:px-0 my-0'>
      <Heading as='h2' className='mb-5 font-brutals-normal mx-auto'>
        {'Upload Pets in Bulk'}
      </Heading>
      <Paragraph className='text-foreground/50 text-center mb-2.5'>
        {'Upload data from pets in bulk with the use of excel'}
      </Paragraph>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <PetBulkUpload />
    </Container>
  );
}
