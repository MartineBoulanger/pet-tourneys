import { TournamentForm } from '@/features/supabase/components/admin/tournaments/TournamentForm';
import { Container, Heading, Divider } from '@/components/ui';

export default function NewTournamentPage() {
  return (
    <>
      <Divider alignment='horizontal' color='light-grey' height='0.5' />
      <Container className='px-0 lg:px-0 my-0'>
        <Heading as='h2' className='text-foreground/80 mb-5'>
          {'Create League Form'}
        </Heading>
        <TournamentForm />
      </Container>
    </>
  );
}
