import { notFound } from 'next/navigation';
import { getTournaments } from '@/supabase/actions/tournaments';
import { Container, Heading, Paragraph } from '@/components/ui';
import { TournamentsList } from '@/components/tournaments';

export async function generateMetadata() {
  return {
    title: 'Tourneys',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL!}/tournaments`,
    },
  };
}

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
        <Heading className='text-red'>{`Error ${status}!`}</Heading>
        <Paragraph>{message}</Paragraph>
      </Container>
    );
  }

  if (!tournaments) return notFound();

  return (
    <Container>
      <Heading>{'Tournaments'}</Heading>
      {tournaments.length > 0 ? (
        <TournamentsList tournaments={tournaments} />
      ) : (
        <Paragraph className='p-4 rounded-lg bg-light-grey text-center shadow-md'>
          {'There are no tournaments available yet.'}
        </Paragraph>
      )}
    </Container>
  );
}
