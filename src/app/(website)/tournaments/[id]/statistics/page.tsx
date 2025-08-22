import { notFound } from 'next/navigation';
import {
  PetCharts,
  BattleCharts,
  PetPerformanceCharts,
  PetSwapsCharts,
  PetAbilitiesCharts,
} from '@/components/statistics/charts';
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
  PageMenu,
  Container,
} from '@/components/ui';
import { PageParams, MatchSearchParams } from '@/types';
import { ChartDataItem, ChartData } from '@/components/statistics/types';
import { Links } from '@/lib/types';
import {
  getMatchBattleStats,
  getTournamentBattleStats,
} from '@/supabase/actions/battle-logs-statistics';

export async function generateMetadata({ params }: { params: PageParams }) {
  const { id } = await params;
  return {
    title: 'Statistics',
    alternates: {
      canonical: `${process.env.BASE_URL!}/tournaments/${id}/statistics`,
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
  let title = 'Tournament Statistics';
  let entityName = '';
  let chartData: ChartData = {
    petUsageData: [],
    petTypeData: [],
    petBreedData: [],
  };

  if (isMatchView) {
    const match = await getMatch(id, matchId);
    if (!match) return notFound();

    stats = await getMatchPetUsage(id, matchId);
    battleStats = await getMatchBattleStats(id, matchId);
    title = 'Match Statistics';
    entityName = `${match.player1} vs ${match.player2}`;
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
          }))
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
          }))
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
        ? `/tournaments/${id}/statistics/pets?matchId=${matchId}`
        : `/tournaments/${id}/statistics/pets`,
      text: 'Pets Statistics',
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
      text: isMatchView
        ? 'Back To Match Details'
        : 'Back To Tournament Details',
    },
  ];

  return (
    <Container className='lg:px-5'>
      <div className='mb-5'>
        <PageHeading heading={title}>
          <PageMenu links={links} />
        </PageHeading>
        {entityName && (
          <Paragraph className='text-humanoid'>{entityName}</Paragraph>
        )}
      </div>
      <PetCharts chartData={chartData} data={stats} />
      <BattleCharts
        matchesStats={battleStats.generalStats}
        isMatchView={isMatchView}
      />
      <PetPerformanceCharts battleStats={battleStats.battleStats} />
      <PetSwapsCharts
        battleStats={battleStats.battleStats}
        isMatchView={isMatchView}
      />
      <PetAbilitiesCharts abilityStats={battleStats.abilityStats} />
    </Container>
  );
}
