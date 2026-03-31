import { Container, Heading, Paragraph } from '@/components/ui';
import { PetCreateForm } from '@/components/admin-panel/pets-management/pets-upload/PetCreateForm';

export default async function AddPetPage() {
  return (
    <Container className='px-0 lg:px-0 my-0'>
      <Heading as='h2' className='mb-5 font-brutals-normal mx-auto'>
        {'Upload a New Pet'}
      </Heading>
      <Paragraph className='text-foreground/50 text-center mb-2.5'>
        {'Upload data from a single pet'}
      </Paragraph>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <PetCreateForm />
    </Container>
  );
}
