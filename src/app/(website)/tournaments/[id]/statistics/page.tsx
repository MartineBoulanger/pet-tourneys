import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  PetUsageChart,
  PetTypeChart,
  PetList,
  PetBreedChart,
} from '@/components/statistics';
import {
  getMatchPetUsage,
  getTournamentPetStats,
} from '@/supabase/actions/statistics';
import { getTournament } from '@/supabase/actions/tournaments';
import { getMatch } from '@/supabase/actions/matches';
import { Container } from '@/components/ui';
import {
  ChartDataItem,
  ChartData,
  PageParams,
  MatchSearchParams,
} from '@/types';

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
  let title = 'Tournament Pet Usage Statistics';
  let entityName = '';
  let chartData: ChartData = {
    petUsageData: [],
    petTypeData: [],
    petBreedData: [],
  };

  if (isMatchView) {
    // Fetch match-specific data
    const match = await getMatch(id, matchId);
    if (!match) return notFound();

    stats = await getMatchPetUsage(id, matchId);
    title = 'Match Pet Usage Statistics';
    entityName = `Match: ${match.player1} vs ${match.player2}`;
  } else {
    // Fetch tournament-wide data
    const {
      success,
      status,
      message,
      data: { tournament },
    } = await getTournament(id);

    if (!success) {
      return (
        <Container className='text-center'>
          <h1 className='text-red'>{`Error ${status}!`}</h1>
          <p>{message}</p>
        </Container>
      );
    }

    if (!tournament) return notFound();

    stats = await getTournamentPetStats(id);
    entityName = tournament.name;

    // Prepare tournament-wide chart data
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

  return (
    <Container>
      <div className='mb-6'>
        <div className='flex flex-col md:flex-row items-start md:items-center justify-center md:justify-between mb-5 md:mb-0'>
          <h1>{title}</h1>
          <Link
            href={
              isMatchView
                ? `/tournaments/${id}/matches/${matchId}`
                : `/tournaments/${id}`
            }
            className='btn-submit py-2 px-4 rounded-lg uppercase md:mb-5'
          >
            {isMatchView ? 'Back to match' : 'Back to tournament'}
          </Link>
        </div>
        {entityName && <p className='text-gray-500'>{entityName}</p>}
      </div>

      {!isMatchView && (
        <div className='mb-6 lg:mb-10'>
          <div className='bg-light-grey p-2.5 sm:p-4 rounded-lg shadow-md'>
            <h2 className='mb-2.5 sm:mb-5 text-lg sm:text-xl'>
              {'Top 10 Most Used Pets'}
            </h2>
            {chartData.petUsageData && (
              <PetUsageChart pets={chartData.petUsageData} />
            )}
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 my-6 lg:my-10'>
            <div className='bg-light-grey p-2.5 sm:p-4 rounded-lg shadow-md'>
              <h2 className='mb-2.5 sm:mb-5 text-lg sm:text-xl'>
                {'Pet Types'}
              </h2>
              {chartData.petTypeData && (
                <PetTypeChart types={chartData.petTypeData} />
              )}
            </div>
            <div className='bg-light-grey p-2.5 sm:p-4 rounded-lg shadow-md'>
              <h2 className='mb-2.5 sm:mb-5 text-lg sm:text-xl'>
                {'Pet Breeds'}
              </h2>
              {chartData.petBreedData && (
                <PetBreedChart breeds={chartData.petBreedData} />
              )}
            </div>
          </div>
        </div>
      )}

      {stats && <PetList stats={stats} matchView={isMatchView} />}
    </Container>
  );
}
