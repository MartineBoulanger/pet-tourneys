import Link from 'next/link';
import { Fragment } from 'react';
import { notFound } from 'next/navigation';
import { PetList, PetCharts } from '@/components/statistics';
import {
  getMatchPetUsage,
  getTournamentPetStats,
} from '@/supabase/actions/statistics';
import { getTournament } from '@/supabase/actions/tournaments';
import { getMatch } from '@/supabase/actions/matches';
import { Container, PageHeading, Heading, Paragraph } from '@/components/ui';
import {
  ChartDataItem,
  ChartData,
  PageParams,
  MatchSearchParams,
} from '@/types';
import { linksData } from '@/lib/linksData';

export async function generateMetadata({ params }: { params: PageParams }) {
  const { id } = await params;
  return {
    title: 'Tourney Stats',
    alternates: {
      canonical: `${process.env
        .NEXT_PUBLIC_BASE_URL!}/tournaments/${id}/statistics`,
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
    title = 'Match Pet Usage';
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
                <Fragment key={link.id}>
                  <Link
                    href={url}
                    className='link'
                    title={linkText}
                    aria-label={linkText}
                  >
                    {linkText}
                  </Link>
                  <div className='h-0.5 rounded-lg w-full bg-blue-grey last-of-type:hidden' />
                </Fragment>
              );
            })}
          </div>
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
