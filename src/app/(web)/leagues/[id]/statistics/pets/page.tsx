import { notFound } from 'next/navigation';
import { PetStatsList } from '@/components/leagues/statistics/PetStatsList';
import { getMatchPetStats } from '@/actions/supabase/api-schema/statistics/getMatchPetStats';
import { getLeaguePetStats } from '@/actions/supabase/api-schema/statistics/getLeaguePetStats';
import { getMatchBattleStats } from '@/actions/supabase/api-schema/statistics/getMatchBattleStats';
import { getLeagueBattleStats } from '@/actions/supabase/api-schema/statistics/getLeagueBattleStats';
import { getLeague } from '@/actions/supabase/api-schema/leagues/getLeagues';
import { getMatch } from '@/actions/supabase/api-schema/matches/getMatches';
import { LeaguePetStat } from '@/types/supabase.types';
import { getAllPets } from '@/actions/supabase/pets-schema/pets/getPets';
import { Heading, Paragraph, Container } from '@/components/ui';
import { PageMenu } from '@/components/navigation/PageMenu';
import { Links } from '@/types/navigation-types';
import { PageParams, MatchSearchParams } from '@/types/global.types';

export async function generateMetadata({ params }: { params: PageParams }) {
  const { id } = await params;
  return {
    title: 'Pets Statistics',
    description: "Pet Masters League season's pet statistics page",
    alternates: {
      canonical: `${process.env.BASE_URL!}/leagues/${id}/statistics/pets`,
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
  const { data: petData, error: petError } = await getAllPets();

  let stats;
  let battleStats;
  let title = 'League Pets Statistics';
  let entityName = '';

  if (isMatchView) {
    const match = await getMatch(id, matchId);
    if (!match) return notFound();

    stats = await getMatchPetStats(id, matchId);
    battleStats = await getMatchBattleStats(id, matchId);
    title = 'Match Pets Statistics';
    entityName = `${match.data?.player1} vs ${match.data?.player2}`;
  } else {
    const { error, data } = await getLeague(id);

    if (error || petError) {
      return (
        <Container className='text-center'>
          <Heading className='text-red'>{'Error!'}</Heading>
          <Paragraph>{error || petError}</Paragraph>
        </Container>
      );
    }

    if (!data) return notFound();

    stats = await getLeaguePetStats(id);
    battleStats = await getLeagueBattleStats(id);
    entityName = data.name;
  }

  if (!stats) return notFound();

  // Create a map of pet stats by name for easy lookup
  const petStatsMap = new Map<string, LeaguePetStat>();
  stats.forEach((stat) => {
    petStatsMap.set(stat.pet_data.name, stat);
  });

  // Filter pet data to only include pets with stats
  const petsWithStats = petData?.filter((pet) => petStatsMap.has(pet.name));

  // make links data for the dropdown menu on the page
  const links: Links = [
    {
      id: 1,
      url: isMatchView
        ? `/leagues/${id}/statistics?matchId=${matchId}`
        : `/leagues/${id}/statistics`,
      text: 'Statistics',
    },
    {
      id: 2,
      url: isMatchView ? '' : `/leagues/${id}/rankings`,
      text: isMatchView ? '' : 'Rankings',
    },
    {
      id: 3,
      url: isMatchView ? `/leagues/${id}/match/${matchId}` : `/leagues/${id}`,
      text: isMatchView ? 'Match Details' : 'League Details',
    },
  ];

  return (
    <Container className='lg:px-5'>
      <div className='mb-5'>
        <Heading>{title}</Heading>
        {entityName && (
          <Paragraph className='flex justify-center text-humanoid gap-2.5 mb-5 lg:mb-10'>
            {entityName}
          </Paragraph>
        )}
      </div>
      <PageMenu links={links} />
      {stats && (
        <PetStatsList
          petData={petsWithStats || []}
          petStats={stats}
          battleStats={battleStats.battleStats}
          isMatchView={isMatchView}
        />
      )}
    </Container>
  );
}
