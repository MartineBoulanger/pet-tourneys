import { TournamentForm } from '@/components/admin';
import { Container } from '@/components/ui';

export default function NewTournamentPage() {
  return (
    <Container className='w-full flex flex-col justify-center max-w-[500px]'>
      <h1 className='text-center'>{'Create Tournament'}</h1>
      <TournamentForm />
    </Container>
  );
}
