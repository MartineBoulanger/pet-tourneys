import { notFound } from 'next/navigation';
import { getTournamentDetails } from '@/features/supabase/actions/tournaments';
import { getPaginatedMatches } from '@/features/supabase/actions/matches';
import { MatchList } from '@/features/supabase/components/tournaments/MatchList';
import { MATCHES_PER_PAGE } from '@/features/supabase/constants';
import {
  Container,
  PageHeading,
  Heading,
  Paragraph,
  PageMenu,
} from '@/components/ui';
import { PageParams, PageSearchParams } from '@/types';
import { Links } from '@/lib/types';

export async function generateMetadata({ params }: { params: PageParams }) {
  const { id } = await params;
  return {
    title: 'League Details',
    alternates: {
      canonical: `${process.env.BASE_URL!}/tournaments/${id}`,
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
      <Container className='text-center lg:px-5'>
        <Heading className='text-red'>{`Error ${status || stat}!`}</Heading>
        <Paragraph>{message}</Paragraph>
      </Container>
    );
  }

  if (!tournament || !matches) return notFound();

  // make links data for the dropdown menu on the page
  const links: Links = [
    {
      id: 1,
      url: `/tournaments/${tournament.id}/statistics`,
      text: 'Statistics',
    },
    {
      id: 2,
      url: `/tournaments/${tournament.id}/statistics/pets`,
      text: 'Pets Statistics',
    },
    {
      id: 3,
      url: `/tournaments/${tournament.id}/rankings`,
      text: 'Rankings',
    },
    {
      id: 4,
      url: '/tournaments',
      text: 'Back To Leagues List',
    },
  ];

  return (
    <Container className='lg:px-5'>
      <PageHeading heading={tournament.name}>
        <PageMenu links={links} />
      </PageHeading>
      <Paragraph className='flex justify-center gap-2.5 mb-5 lg:mb-10'>
        <span>
          {new Date(tournament.start_date).toLocaleDateString()} -{' '}
          {tournament.end_date === '1999-12-31T22:00:00' ||
          tournament.end_date === null
            ? 'Ongoing'
            : new Date(tournament.end_date).toLocaleDateString()}
        </span>
        <span className='italic text-humanoid text-sm'>
          {tournament.participant_count}
          {' participants'}
        </span>
      </Paragraph>
      {matches && matches.length > 0 ? (
        <MatchList
          matches={matches}
          tournamentId={tournament.id}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      ) : (
        <Paragraph className='p-2.5 lg:p-5 rounded-lg bg-background text-center shadow-md'>
          {'There are no matches for this league available yet.'}
        </Paragraph>
      )}
    </Container>
  );
}
