import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTournamentDetails } from '@/supabase/actions/tournaments';
import { MatchList } from '@/components/tournaments';
import { Container } from '@/components/ui';
import { PageParams } from '@/types';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tourney Details',
};

export default async function TournamentPage({
  params,
}: {
  params: PageParams;
}) {
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
      <div className='flex flex-wrap items-center justify-between mb-10 min-[1200px]:mb-0'>
        <h1>{tournament.name}</h1>
        <Link
          href={`/tournaments/${tournament.id}/statistics`}
          className='btn-submit py-2 px-4 rounded-lg uppercase w-fit mb-0 min-[1200px]:mb-5'
        >
          {'View Tournament Statistics'}
        </Link>
      </div>
      <div className='mb-10 text-gray-500'>
        <p>
          {new Date(tournament.start_date).toLocaleDateString()} -{' '}
          {tournament.end_date === '1999-12-31T22:00:00' ||
          tournament.end_date === null
            ? 'Ongoing'
            : new Date(tournament.end_date).toLocaleDateString()}
        </p>
        <p>
          {tournament.participant_count}
          {' participants'}
        </p>
      </div>
      {matches.length > 0 ? (
        <MatchList matches={matches} tournamentId={tournament.id} />
      ) : (
        <p className='p-4 rounded-lg bg-light-grey text-center shadow-md'>
          {'There are no matches for this tournament available yet.'}
        </p>
      )}
    </Container>
  );
}
