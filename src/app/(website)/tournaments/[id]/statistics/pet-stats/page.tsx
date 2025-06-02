import { notFound } from 'next/navigation';
import { PetList } from '@/components/statistics';
import {
  getMatchPetUsage,
  getTournamentPetStats,
} from '@/supabase/actions/pet-usage-statistics';
import { getTournament } from '@/supabase/actions/tournaments';
import { getMatch } from '@/supabase/actions/matches';
import {
  PageHeading,
  Heading,
  Paragraph,
  ActionDropdown,
  Container,
} from '@/components/ui';
import { PageParams, MatchSearchParams } from '@/types';
import { Links } from '@/lib/types';

export async function generateMetadata({ params }: { params: PageParams }) {
  const { id } = await params;
  return {
    title: 'Pets Statistics',
    alternates: {
      canonical: `${process.env
        .NEXT_PUBLIC_BASE_URL!}/tournaments/${id}/statistics/pet-stats`,
    },
  };
}

export default async function PetUsageStatisticsPage({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: MatchSearchParams;
}) {
  const { id } = await params;
  const { matchId } = await searchParams;
  const isMatchView = !!matchId;

  let stats;
  let title = 'Tournament Pets Statistics';
  let entityName = '';

  if (isMatchView) {
    const match = await getMatch(id, matchId);
    if (!match) return notFound();

    stats = await getMatchPetUsage(id, matchId);
    title = 'Match Pets Statistics';
    entityName = `${match.player1} vs ${match.player2}`;
  } else {
    const {
      success,
      status,
      message,
      data: { tournament },
    } = await getTournament(id);

    if (!success) {
      return (
        <div className='text-center'>
          <Heading className='text-red'>{`Error ${status}!`}</Heading>
          <Paragraph>{message}</Paragraph>
        </div>
      );
    }

    if (!tournament) return notFound();

    stats = await getTournamentPetStats(id);
    entityName = tournament.name;
  }

  if (!stats) return notFound();

  // make links data for the dropdown menu on the page
  const links: Links = [
    {
      id: 1,
      url: isMatchView
        ? `/tournaments/${id}/statistics?matchId=${matchId}`
        : `/tournaments/${id}/statistics`,
      text: isMatchView ? 'Match Statistics' : 'Tournament Statistics',
    },
    {
      id: 2,
      url: isMatchView
        ? `/tournaments/${id}/matches/${matchId}`
        : `/tournaments/${id}`,
      text: isMatchView ? 'Back to match' : 'Back to tournament',
    },
  ];

  // TODO: The pet list will change so that there will be statistics per pet as well from the tournament
  return (
    <Container>
      <div className='mb-5'>
        <PageHeading heading={title}>
          <ActionDropdown links={links} />
        </PageHeading>
        {entityName && (
          <Paragraph className='text-humanoid'>{entityName}</Paragraph>
        )}
      </div>
      {stats && <PetList data={stats} isMatchView={isMatchView} />}
    </Container>
  );
}
