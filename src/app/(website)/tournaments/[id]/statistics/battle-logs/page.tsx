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
  ActionDropdownItem,
} from '@/components/ui';
import { linksData } from '@/lib/linksData';
import { BattleLogsStats } from '@/components/statistics';
import { PageParams, MatchSearchParams } from '@/types';

export async function generateMetadata({ params }: { params: PageParams }) {
  const { id } = await params;
  return {
    title: 'Battle Analysis',
    alternates: {
      canonical: `${process.env
        .NEXT_PUBLIC_BASE_URL!}/tournaments/${id}/statistics/battle-analysis`,
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

  return (
    <Container>
      <div className='mb-6'>
        <PageHeading heading={title}>
          <div className='flex flex-col gap-2.5'>
            {linksData.statistics.map((link) => {
              const url = link.full_url
                ? link.full_url
                : isMatchView
                ? `${link.url_prefix}${id}${link.url_suffix}${matchId}`
                : `${link.url_prefix}${id}`;
              const linkText = link.text
                ? link.text
                : isMatchView
                ? 'Back to match'
                : 'Back to tournament';
              return (
                <ActionDropdownItem key={link.id} url={url} text={linkText} />
              );
            })}
          </div>
        </PageHeading>
        {entityName && (
          <Paragraph className='text-light-blue'>{entityName}</Paragraph>
        )}
      </div>

      <BattleLogsStats stats={stats} isMatchView={isMatchView} />
    </Container>
  );
}
