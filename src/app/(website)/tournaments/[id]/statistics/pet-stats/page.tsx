// import { notFound } from 'next/navigation';
// import { PetList, PetCharts } from '@/components/statistics';
// import {
//   getMatchPetUsage,
//   getTournamentPetStats,
// } from '@/supabase/actions/pet-usage-statistics';
// import { getTournament } from '@/supabase/actions/tournaments';
// import { getMatch } from '@/supabase/actions/matches';
import {
  Container,
  PageHeading,
  Paragraph,
  ActionDropdown,
} from '@/components/ui';
import { PageParams, MatchSearchParams } from '@/types';
import { Links } from '@/lib/types';

export async function generateMetadata({ params }: { params: PageParams }) {
  const { id } = await params;
  return {
    title: 'Pet Stats',
    alternates: {
      canonical: `${process.env
        .NEXT_PUBLIC_BASE_URL!}/tournaments/${id}/statistics/pet-stats`,
    },
  };
}

export default async function PetStatsPage({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: MatchSearchParams;
}) {
  const { id } = await params;
  const { matchId } = await searchParams;
  const isMatchView = !!matchId;
  const title = isMatchView
    ? 'Match Pet Statistics'
    : 'Tournament Pet Statistics';

  // make links data for the dropdown menu on the page
  const links: Links = [
    {
      id: 1,
      url: `/tournaments/${id}/statistics/pet-usage${
        isMatchView ? `?matchId=${matchId}` : ''
      }`,
      text: 'Pet Usage Statistics',
    },
    {
      id: 2,
      url: `/tournaments/${id}/statistics/battle-logs${
        isMatchView ? `?matchId=${matchId}` : ''
      }`,
      text: 'Battle Logs Statistics',
    },
    {
      id: 3,
      url: isMatchView
        ? `/tournaments/${id}/matches/${matchId}`
        : `/tournaments/${id}`,
      text: isMatchView ? 'Back to match' : 'Back to tournament',
    },
  ];

  return (
    <Container>
      <div className='mb-6'>
        <PageHeading heading={title}>
          <ActionDropdown links={links} />
        </PageHeading>
        {/* {entityName && (
          <Paragraph className='text-light-blue'>{entityName}</Paragraph>
        )} */}
      </div>
    </Container>
  );
}
