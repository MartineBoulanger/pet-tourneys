import { Container, Heading, Divider } from '@/components/ui';
import { PrizesManager } from '@/components/admin/cms/prizes/PrizesManager';

export default async function AdminPrizesPage() {
  return (
    <Container className='px-0 lg:px-0'>
      <Divider alignment='horizontal' color='light-grey' height='0.5' />
      <Heading as='h2' className='font-sans tracking-normal text-xl mb-2.5'>
        {'Manage Tournament Prizes'}
      </Heading>
      <PrizesManager />
    </Container>
  );
}
