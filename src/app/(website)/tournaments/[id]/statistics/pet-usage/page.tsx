import { notFound } from 'next/navigation';
import { PetList, PetCharts } from '@/components/statistics';
import {
  getMatchPetUsage,
  getTournamentPetStats,
} from '@/supabase/actions/pet-usage-statistics';
import { getTournament } from '@/supabase/actions/tournaments';
import { getMatch } from '@/supabase/actions/matches';
import {
  Container,
  PageHeading,
  Heading,
  Paragraph,
  ActionDropdown,
} from '@/components/ui';
import { PageParams, MatchSearchParams } from '@/types';
import { ChartDataItem, ChartData } from '@/components/statistics/types';
import { Links } from '@/lib/types';

export async function generateMetadata({ params }: { params: PageParams }) {
  const { id } = await params;
  return {
    title: 'Pet Usage Statistics',
    alternates: {
      canonical: `${process.env
        .NEXT_PUBLIC_BASE_URL!}/tournaments/${id}/statistics/pet-usage`,
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
  let title = 'Tournament Pet Usage Statistics';
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
    title = 'Match Pet Usage Statistics';
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
        <Container className='text-center'>
          <Heading className='text-red'>{`Error ${status}!`}</Heading>
          <Paragraph>{message}</Paragraph>
        </Container>
      );
    }

    if (!tournament) return notFound();

    stats = await getTournamentPetStats(id);
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
      url: `/tournaments/${id}/statistics/battle-logs${
        isMatchView ? `?matchId=${matchId}` : ''
      }`,
      text: 'Battle Logs Statistics',
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
      {!isMatchView && <PetCharts chartData={chartData} stats={stats} />}
      {stats && <PetList stats={stats} matchView={isMatchView} />}
    </Container>
  );
}
