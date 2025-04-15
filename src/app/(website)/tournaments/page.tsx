import { notFound } from 'next/navigation';
import { getTournaments } from '@/supabase/actions/tournaments';
import { Container } from '@/components/ui';
import { TournamentsList } from '@/components/tournaments';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tourneys',
};

export default async function TournamentsPage() {
  const {
    success,
    status,
    message,
    data: { tournaments },
  } = await getTournaments();

  if (!success) {
    return (
      <Container className='text-center'>
        <h1 className='text-red'>{`Error ${status}!`}</h1>
        <p>{message}</p>
      </Container>
    );
  }

  if (!tournaments) return notFound();

  return (
    <Container>
      <h1>{'Tournaments'}</h1>
      {tournaments.length > 0 ? (
        <TournamentsList tournaments={tournaments} />
      ) : (
        <p className='p-4 rounded-lg bg-light-grey text-center shadow-md'>
          {'There are no tournaments available yet.'}
        </p>
      )}
    </Container>
  );
}
