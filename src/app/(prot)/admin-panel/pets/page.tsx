import { Container, Heading, Paragraph } from '@/components/ui';
import { cn } from '@/utils/cn';
import { getPets } from '@/actions/supabase/pets-schema/pets/getPets';
import { PetsManager } from '@/components/admin-panel/pets-management/Manager';

export async function generateMetadata() {
  return {
    title: 'Upload Pets Data',
    robots: { index: false, follow: false },
  };
}

export default async function AdminPetsPage() {
  const result = await getPets();
  const pets = result.success ? result.data : [];

  return (
    <Container className='px-0 lg:px-0 my-0 relative'>
      <Heading as='h2' className='mb-5 font-brutals-normal mx-auto'>
        {'Manage all pet data here'}
      </Heading>
      <Paragraph className='text-foreground/50 text-center mb-2.5'>
        {
          'You can add, edit, or remove pets as needed. Click on the buttons above to go to the correct upload pages.'
        }
      </Paragraph>
      <div className={cn('rounded-full w-20 h-1 my-5 mx-auto bg-humanoid')} />
      <PetsManager initialPets={pets} path='/admin-panel/pets' />
    </Container>
  );
}
