import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MatchListItem } from '@/components/tournaments';
import { Container, PageHeading } from '@/components/ui';
import { getTournamentDetails } from '@/supabase/actions/tournaments';
import { PageParams } from '@/types';

export async function generateMetadata({ params }: { params: PageParams }) {
  const { id } = await params;
  return {
    title: 'Tourney Matches List',
    alternates: {
      canonical: `${process.env
        .NEXT_PUBLIC_BASE_URL!}/tournaments/${id}/matches`,
    },
  };
}

export default async function MatchesPage({ params }: { params: PageParams }) {
  const { id } = await params;
  const {
    success,
    status,
    message,
    data: { tournament, matches },
  } = await getTournamentDetails(id);

  if (!success) {
    return (
      <Container className='text-center'>
        <h1 className='text-red'>{`Error ${status}!`}</h1>
        <p>{message}</p>
      </Container>
    );
  }

  if (!tournament || !matches) return notFound();

  return (
    <Container>
      <div className='mb-6'>
        <PageHeading heading={'All Tournament Matches'}>
          <Link href={`/tournaments/${id}`} className='link'>
            {'Back To Tournament'}
          </Link>
        </PageHeading>
        <p className='text-gray-500'>{tournament?.name}</p>
      </div>
      <div className='grid gap-4'>
        {matches.map((match) => (
          <MatchListItem tournamentId={id} key={match.id} match={match} />
        ))}
      </div>
      {matches?.length === 0 && (
        <div className='text-center text-gray-500'>
          {'No matches found for this tournament.'}
        </div>
      )}
    </Container>
  );
}
