import { TournamentForm } from '@/components/admin';
import { Container, Heading } from '@/components/ui';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create New Tourney',
  robots: { index: false, follow: false },
};

export default function NewTournamentPage() {
  return (
    <Container className='w-full flex flex-col justify-center max-w-[500px]'>
      <Heading className='text-center'>{'Create Tournament'}</Heading>
      <TournamentForm />
    </Container>
  );
}
