import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTournamentDetails } from '@/supabase/actions/tournaments';
import { getPaginatedMatches } from '@/supabase/actions/matches';
import { MatchList } from '@/components/tournaments';
import { Container, PageHeading } from '@/components/ui';
import { PageParams, PageSearchParams } from '@/types';

export async function generateMetadata({ params }: { params: PageParams }) {
  const { id } = await params;
  return {
    title: 'Tourney Details',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL!}/tournaments/${id}`,
    },
  };
}

export default async function TournamentPage({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: PageSearchParams;
}) {
  const { id } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const MATCHES_PER_PAGE = 10;
  const offset = (currentPage - 1) * MATCHES_PER_PAGE;

  const {
    success,
    status,
    message,
    data: { tournament },
  } = await getTournamentDetails(id);

  const {
    success: succ,
    status: stat,
    data: { matches, totalPages },
  } = await getPaginatedMatches(id, offset, MATCHES_PER_PAGE);

  if (!success || !succ) {
    return (
      <Container className='text-center'>
        <h1 className='text-red'>{`Error ${status || stat}!`}</h1>
        <p>{message}</p>
      </Container>
    );
  }

  if (!tournament || !matches) return notFound();

  return (
    <Container>
      <PageHeading heading={tournament.name}>
        <div className='flex flex-col gap-2.5'>
          <Link
            href={`/tournaments/${tournament.id}/statistics`}
            className='link'
          >
            {'View Tourney Pets Statistics'}
          </Link>
          <div className='h-0.5 rounded-lg w-full bg-blue-grey' />
          <Link href={`/tournaments`} className='link'>
            {'Back To Tournaments List'}
          </Link>
        </div>
      </PageHeading>
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
      {matches && matches.length > 0 ? (
        <MatchList
          matches={matches}
          tournamentId={tournament.id}
          currentPage={currentPage}
          totalPages={totalPages}
          showPagination
        />
      ) : (
        <p className='p-4 rounded-lg bg-light-grey text-center shadow-md'>
          {'There are no matches for this tournament available yet.'}
        </p>
      )}
    </Container>
  );
}
