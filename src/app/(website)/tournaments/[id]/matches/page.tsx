import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MatchListItem } from '@/components/tournaments';
import { Container } from '@/components/ui';
import { getTournamentDetails } from '@/supabase/actions/tournaments';
import { PageParams } from '@/types';

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
        <div className='flex flex-col md:flex-row items-start md:items-center justify-center md:justify-between mb-5 md:mb-0'>
          <h1>{'Matches'}</h1>
          <Link
            href={`/tournaments/${id}`}
            className='btn-submit py-2 px-4 rounded-lg uppercase'
          >
            {'Back To Tournament'}
          </Link>
        </div>
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
