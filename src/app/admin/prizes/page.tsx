import { Container, Heading, Divider } from '@/components/ui';
import { PrizesManager } from '@/features/cms/components/prizes/PrizesManager';

export default async function AdminPrizesPage() {
  return (
    <Container className='px-0 lg:px-0 my-0'>
      <Divider alignment='horizontal' color='light-grey' height='0.5' />
      <Heading as='h2' className='text-foreground/80 mb-5'>
        {'Manage League Prizes'}
      </Heading>
      <PrizesManager />
    </Container>
  );
}
