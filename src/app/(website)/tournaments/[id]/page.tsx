import { notFound } from 'next/navigation';
import { getTournamentDetails } from '@/supabase/actions/tournaments';
import { getPaginatedMatches } from '@/supabase/actions/matches';
import { MatchList } from '@/components/tournaments';
import {
  Container,
  PageHeading,
  Heading,
  Paragraph,
  ActionDropdown,
} from '@/components/ui';
import { PageParams, PageSearchParams } from '@/types';
import { Links } from '@/lib/types';
import { MATCHES_PER_PAGE } from '@/utils/constants';

export async function generateMetadata({ params }: { params: PageParams }) {
  const { id } = await params;
  return {
    title: 'Tournament Details',
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
      text: 'Tournament Statistics',
    },
    {
      id: 2,
      url: `/tournaments/${tournament.id}/statistics/pets`,
      text: 'Tournament Pets Statistics',
    },
    {
      id: 3,
      url: `/tournaments/${tournament.id}/rankings`,
      text: 'Tournament Rankings',
    },
    {
      id: 4,
      url: '/tournaments',
      text: 'Back To Tournaments',
    },
  ];

  return (
    <Container>
      <PageHeading heading={tournament.name}>
        <ActionDropdown links={links} />
      </PageHeading>
      <div className='mb-5 sm:mb-10'>
        <Paragraph>
          {new Date(tournament.start_date).toLocaleDateString()} -{' '}
          {tournament.end_date === '1999-12-31T22:00:00' ||
          tournament.end_date === null
            ? 'Ongoing'
            : new Date(tournament.end_date).toLocaleDateString()}
        </Paragraph>
        <Paragraph className='font-bold text-humanoid'>
          {tournament.participant_count}
          {' participants'}
        </Paragraph>
      </div>
      {matches && matches.length > 0 ? (
        <MatchList
          matches={matches}
          tournamentId={tournament.id}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      ) : (
        <Paragraph className='p-2.5 sm:p-5 rounded-lg bg-background text-center shadow-md'>
          {'There are no matches for this tournament available yet.'}
        </Paragraph>
      )}
    </Container>
  );
}
