import { TournamentForm } from '@/components/admin';
import { Container, Heading } from '@/components/ui';

export async function generateMetadata() {
  return {
    title: 'Create Tournament',
    robots: { index: false, follow: false },
  };
}

export default function NewTournamentPage() {
  return (
    <Container className='w-full flex flex-col justify-center max-w-[512px]'>
      <Heading className='text-center'>{'Create Tournament'}</Heading>
      <TournamentForm />
    </Container>
  );
}
