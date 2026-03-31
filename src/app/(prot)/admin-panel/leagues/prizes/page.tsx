import { Container, Heading, Paragraph } from '@/components/ui';
import { PrizesManager } from '@/components/admin-panel/league-management/PrizesManager';

export default async function AdminPrizesPage() {
  return (
    <Container className='px-0 lg:px-0 my-0'>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <Heading as='h2' className='mb-5 font-brutals-normal mx-auto'>
        {'Manage League Prizes'}
      </Heading>
      <Paragraph className='text-foreground/50 text-center mb-2.5'>
        {'Manage all prizes for the league prizes page'}
      </Paragraph>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <PrizesManager />
    </Container>
  );
}
