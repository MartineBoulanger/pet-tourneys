import { notFound } from 'next/navigation';
import { getLeagueDetails } from '@/actions/supabase/api-schema/leagues/getLeagues';
import { getPlayerRecords } from '@/actions/supabase/api-schema/matches/getPlayers';
import { PlayerRankings } from '@/components/leagues/PlayerRankings';
import { Container, Heading, Paragraph } from '@/components/ui';
import { PageMenu } from '@/components/navigation/PageMenu';
import { Links } from '@/types/navigation-types';
import { PageParams } from '@/types/global.types';

export async function generateMetadata({ params }: { params: PageParams }) {
  const { id } = await params;
  return {
    title: 'League Rankings',
    description: "Pet Masters League season's ranking page",
    alternates: {
      canonical: `${process.env.BASE_URL!}/leagues/${id}/rankings`,
    },
  };
}

export default async function RankingsPage({ params }: { params: PageParams }) {
  const { id } = await params;
  const { error, data } = await getLeagueDetails(id);
  const { records, regions, error: err } = await getPlayerRecords(id);

  // Check if data is available
  const hasPlayerData =
    records && regions && records.length > 0 && regions.length > 0;

  if (error || err) {
    return (
      <Container className='text-center lg:px-5'>
        <Heading className='text-red'>{`Error!`}</Heading>
        <Paragraph>{error || err}</Paragraph>
      </Container>
    );
  }

  // TODO: make een generic error component die een param mer titel met default value heeft en een param voor de tekst met een default value -- zodat deze ook op de error page gebruikt kan worden
  // TODO: maak ook de error page

  if (!hasPlayerData) {
    return (
      <Container className='lg:px-5'>
        <Heading className='text-red'>{`No Player Found!`}</Heading>
        <Paragraph className='w-full bg-background text-center py-5 rounded-lg'>
          {'No player rankings data is found.'}
        </Paragraph>
      </Container>
    );
  }

  if (!data?.league || !data.matches) return notFound();

  const links: Links = [
    {
      id: 1,
      url: `/leagues/${data?.league?.id}/statistics`,
      text: 'Statistics',
    },
    {
      id: 2,
      url: `/leagues/${data?.league?.id}/statistics/pets`,
      text: 'Pets Statistics',
    },
    {
      id: 3,
      url: `/leagues/${data?.league?.id}`,
      text: 'League Details',
    },
  ];

  return (
    <Container className='lg:px-5'>
      <Heading>{'Rankings'}</Heading>
      <Paragraph className='flex justify-center gap-2.5 mb-5 lg:mb-10 text-foreground/80 text-sm'>
        {data.league.name}
      </Paragraph>
      <PageMenu links={links} />
      <PlayerRankings records={records} regions={regions} id={data.league.id} />
    </Container>
  );
}
