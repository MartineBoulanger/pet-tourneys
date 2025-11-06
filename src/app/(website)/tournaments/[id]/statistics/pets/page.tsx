import { notFound } from 'next/navigation';
import { PetStatsList } from '@/features/supabase/components/statistics/PetStatsList';
import {
  getMatchPetUsage,
  getTournamentPetStats,
} from '@/features/supabase/actions/pet-usage-statistics';
import {
  getMatchBattleStats,
  getTournamentBattleStats,
} from '@/features/supabase/actions/battle-logs-statistics';
import { getTournament } from '@/features/supabase/actions/tournaments';
import { getMatch } from '@/features/supabase/actions/matches';
import { TournamentPetStat } from '@/features/supabase/types';
import { Pet } from '@/features/supabase/components/statistics/types';
import { loadPetsData } from '@/features/supabase/utils/loadJsonData';
import {
  PageHeading,
  Heading,
  Paragraph,
  PageMenu,
  Container,
} from '@/components/ui';
import { Links } from '@/lib/types';
import { PageParams, MatchSearchParams } from '@/types';

export async function generateMetadata({ params }: { params: PageParams }) {
  const { id } = await params;
  return {
    title: 'Pets Statistics',
    description: "Pet Masters League season's pet statistics page",
    alternates: {
      canonical: `${process.env.BASE_URL!}/tournaments/${id}/statistics/pets`,
    },
  };
}

export default async function PetsStatisticsPage({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: MatchSearchParams;
}) {
  const { id } = await params;
  const { matchId } = await searchParams;
  const isMatchView = !!matchId;
  const petData: Pet[] = await loadPetsData();

  let stats;
  let battleStats;
  let title = 'League Pets Statistics';
  let entityName = '';

  if (isMatchView) {
    const match = await getMatch(id, matchId);
    if (!match) return notFound();

    stats = await getMatchPetUsage(id, matchId);
    battleStats = await getMatchBattleStats(id, matchId);
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
        <Container className='text-center lg:px-5'>
          <Heading className='text-red'>{`Error ${status}!`}</Heading>
          <Paragraph>{message}</Paragraph>
        </Container>
      );
    }

    if (!tournament) return notFound();

    stats = await getTournamentPetStats(id);
    battleStats = await getTournamentBattleStats(id);
    entityName = tournament.name;
  }

  if (!stats) return notFound();

  // Create a map of pet stats by name for easy lookup
  const petStatsMap = new Map<string, TournamentPetStat>();
  stats.forEach((stat) => {
    petStatsMap.set(stat.pet_data.name, stat);
  });

  // Filter pet data to only include pets with stats
  const petsWithStats = petData.filter((pet) => petStatsMap.has(pet.name));

  // make links data for the dropdown menu on the page
  const links: Links = [
    {
      id: 1,
      url: isMatchView
        ? `/tournaments/${id}/statistics?matchId=${matchId}`
        : `/tournaments/${id}/statistics`,
      text: 'Statistics',
    },
    {
      id: 2,
      url: isMatchView ? '' : `/tournaments/${id}/rankings`,
      text: isMatchView ? '' : 'Rankings',
    },
    {
      id: 3,
      url: isMatchView
        ? `/tournaments/${id}/matches/${matchId}`
        : `/tournaments/${id}`,
      text: isMatchView ? 'Back To Match Details' : 'Back To League Details',
    },
  ];

  return (
    <Container className='lg:px-5'>
      <div className='mb-5'>
        <PageHeading heading={title}>
          <PageMenu links={links} />
        </PageHeading>
        {entityName && (
          <Paragraph className='flex justify-center text-humanoid gap-2.5 mb-5 lg:mb-10'>
            {entityName}
          </Paragraph>
        )}
      </div>
      {stats && (
        <PetStatsList
          petData={petsWithStats}
          petStats={stats}
          battleStats={battleStats.battleStats}
          isMatchView={isMatchView}
        />
      )}
    </Container>
  );
}
