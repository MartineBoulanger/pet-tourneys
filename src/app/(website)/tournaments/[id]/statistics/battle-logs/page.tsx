import { notFound } from 'next/navigation';
import {
  getTournamentBattleStats,
  getMatchBattleStats,
} from '@/supabase/actions/battle-logs-statistics';
import { getTournament } from '@/supabase/actions/tournaments';
import { getMatch } from '@/supabase/actions/matches';
import {
  Container,
  PageHeading,
  Paragraph,
  ActionDropdown,
} from '@/components/ui';
import { BattleLogsStats } from '@/components/statistics';
import { PageParams, MatchSearchParams } from '@/types';
import { Links } from '@/lib/types';

export async function generateMetadata({ params }: { params: PageParams }) {
  const { id } = await params;
  return {
    title: 'Battle Logs Statistics',
    alternates: {
      canonical: `${process.env
        .NEXT_PUBLIC_BASE_URL!}/tournaments/${id}/statistics/battle-logs`,
    },
  };
}

export default async function BattleLogsStatisticsPage({
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
  let title = 'Tournament Battle Logs Statistics';
  let entityName = '';

  if (isMatchView) {
    const match = await getMatch(id, matchId);
    if (!match) return notFound();

    stats = await getMatchBattleStats(id, matchId);
    title = 'Match Battle Logs Statistics';
    entityName = `${match.player1} vs ${match.player2}`;
  } else {
    const tournament = await getTournament(id);
    if (!tournament?.data?.tournament) return notFound();

    stats = await getTournamentBattleStats(id);
    entityName = tournament.data.tournament.name;
  }

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
        {entityName && (
          <Paragraph className='text-light-blue'>{entityName}</Paragraph>
        )}
      </div>

      <BattleLogsStats stats={stats} isMatchView={isMatchView} />
    </Container>
  );
}
