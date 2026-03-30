import { notFound } from 'next/navigation';
import { PetCharts } from '@/components/leagues/statistics/PetCharts';
import { BattleCharts } from '@/components/leagues/statistics/BattleCharts';
import { PetPerformanceCharts } from '@/components/leagues/statistics/PetPerformanceCharts';
import { PetSwapsCharts } from '@/components/leagues/statistics/PetSwapsCharts';
import { PetAbilitiesCharts } from '@/components/leagues/statistics/PetAbilitiesCharts';
import { ChartDataItem, ChartData } from '@/types/supabase.types';
import { getMatchPetStats } from '@/actions/supabase/api-schema/statistics/getMatchPetStats';
import { getLeaguePetStats } from '@/actions/supabase/api-schema/statistics/getLeaguePetStats';
import { getMatchBattleStats } from '@/actions/supabase/api-schema/statistics/getMatchBattleStats';
import { getLeagueBattleStats } from '@/actions/supabase/api-schema/statistics/getLeagueBattleStats';
import { getLeague } from '@/actions/supabase/api-schema/leagues/getLeagues';
import { getMatch } from '@/actions/supabase/api-schema/matches/getMatches';
import { Heading, Paragraph, Container } from '@/components/ui';
import { PageMenu } from '@/components/navigation/PageMenu';
import { PageParams, MatchSearchParams } from '@/types/global.types';
import { Links } from '@/types/navigation-types';

export async function generateMetadata({ params }: { params: PageParams }) {
  const { id } = await params;
  return {
    title: 'Statistics',
    description: "Pet Masters League season's statistics page",
    alternates: {
      canonical: `${process.env.BASE_URL!}/leagues/${id}/statistics`,
    },
  };
}

export default async function StatisticsPage({
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
  let battleStats;
  let title = 'League Statistics';
  let entityName = '';
  let chartData: ChartData = {
    petUsageData: [],
    petTypeData: [],
    petBreedData: [],
  };

  if (isMatchView) {
    const match = await getMatch(id, matchId);
    if (!match) return notFound();

    stats = await getMatchPetStats(id, matchId);
    battleStats = await getMatchBattleStats(id, matchId);
    title = 'Match Statistics';
    entityName = `${match.data?.player1} vs ${match.data?.player2}`;
    chartData = {
      petUsageData: stats.slice(0, 10).map((pet) => ({
        name: pet.pet_data.name,
        value: pet.total_played, // This goes to the chart
        stats: pet.pet_data.stats,
        type: pet.pet_data.type,
        breeds: pet.pet_data.breeds,
        total_played: pet.total_played, // This preserves the original value
      })),
      petTypeData: stats.reduce((acc: ChartDataItem[], pet) => {
        const existing = acc.find((item) => item.name === pet.pet_data.type);
        if (existing) {
          existing.value += pet.total_played;
        } else {
          acc.push({
            name: pet.pet_data.type,
            value: pet.total_played,
          });
        }
        return acc;
      }, []),
      petBreedData: stats
        .flatMap((pet) =>
          pet.breed_stats.map((breedStat) => ({
            name: breedStat.breed,
            value: breedStat.times_played,
          })),
        )
        .reduce((acc: ChartDataItem[], breed) => {
          const existing = acc.find((item) => item.name === breed.name);
          if (existing) {
            existing.value += breed.value;
          } else {
            acc.push(breed);
          }
          return acc;
        }, []),
    };
  } else {
    const { error, data } = await getLeague(id);

    if (error) {
      return (
        <Container className='text-center'>
          <Heading className='text-red'>{'Error!'}</Heading>
          <Paragraph>{error}</Paragraph>
        </Container>
      );
    }

    if (!data) return notFound();

    stats = await getLeaguePetStats(id);
    battleStats = await getLeagueBattleStats(id);
    entityName = data.name;
    chartData = {
      petUsageData: stats.slice(0, 10).map((pet) => ({
        name: pet.pet_data.name,
        value: pet.total_played, // This goes to the chart
        stats: pet.pet_data.stats,
        type: pet.pet_data.type,
        breeds: pet.pet_data.breeds,
        total_played: pet.total_played, // This preserves the original value
      })),
      petTypeData: stats.reduce((acc: ChartDataItem[], pet) => {
        const existing = acc.find((item) => item.name === pet.pet_data.type);
        if (existing) {
          existing.value += pet.total_played;
        } else {
          acc.push({
            name: pet.pet_data.type,
            value: pet.total_played,
          });
        }
        return acc;
      }, []),
      petBreedData: stats
        .flatMap((pet) =>
          pet.breed_stats.map((breedStat) => ({
            name: breedStat.breed,
            value: breedStat.times_played,
          })),
        )
        .reduce((acc: ChartDataItem[], breed) => {
          const existing = acc.find((item) => item.name === breed.name);
          if (existing) {
            existing.value += breed.value;
          } else {
            acc.push(breed);
          }
          return acc;
        }, []),
    };
  }

  if (!stats) return notFound();

  // make links data for the dropdown menu on the page
  const links: Links = [
    {
      id: 1,
      url: isMatchView
        ? `/leagues/${id}/statistics/pets?matchId=${matchId}`
        : `/leagues/${id}/statistics/pets`,
      text: 'Pets Statistics',
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
      <div className='mt-5'>
        <PetCharts chartData={chartData || null} data={stats || null} />
        <BattleCharts
          matchesStats={battleStats?.generalStats || null}
          isMatchView={isMatchView}
        />
        <PetPerformanceCharts battleStats={battleStats?.battleStats || null} />
        <PetSwapsCharts
          battleStats={battleStats?.battleStats || null}
          isMatchView={isMatchView}
        />
        <PetAbilitiesCharts abilityStats={battleStats?.abilityStats || null} />
      </div>
    </Container>
  );
}
