import { notFound } from 'next/navigation';
import { getTournamentDetails } from '@/supabase/actions/tournaments';
import {
  Container,
  PageHeading,
  Heading,
  Paragraph,
  ActionDropdown,
} from '@/components/ui';
import { PageParams } from '@/types';
import { Links } from '@/lib/types';
import { PlayerRankings } from '@/components/tournaments';
import { getPlayerRecords } from '@/supabase/actions/players';
import { loadJsonData } from '@/utils/loadJsonData'

export async function generateMetadata({ params }: { params: PageParams }) {
  const { id } = await params;
  return {
    title: 'Tournament Rankings',
    alternates: {
      canonical: `${process.env
        .NEXT_PUBLIC_BASE_URL!}/tournaments/${id}/rankings`,
    },
  };
}

async function loadPlayerData(id: string) {
  try {
    const jsonPath = `${process.env
      .NEXT_PUBLIC_BASE_URL!}/json-files/rankings-data/player-rankings-${id.slice(
      0,
      5
    )}.json`;

    const response = await fetch(jsonPath, { cache: 'no-store' });

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Expected JSON but got: ${text.substring(0, 50)}...`);
    }

    const jsonData = await response.json();

    if (!jsonData.records || !jsonData.regions) {
      throw new Error('Invalid JSON structure - missing records or regions');
    }

    return jsonData;
  } catch (jsonError) {
    console.error('JSON load failed, falling back to Supabase', jsonError);

    try {
      const { records, regions } = await getPlayerRecords(id);
      return { records, regions };
    } catch (supabaseError) {
      console.error('Both JSON and Supabase failed:', supabaseError);
      throw new Error('Failed to load player data from any source');
    }
  }
}

export default async function RankingsPage({ params }: { params: PageParams }) {
  const { id } = await params;

  const {
    success,
    status,
    message,
    data: { tournament, matches },
  } = await getTournamentDetails(id);

  const playerData = await loadPlayerData(id);

  if (!success) {
    return (
      <Container className='text-center'>
        <Heading className='text-red'>{`Error ${status}!`}</Heading>
        <Paragraph>{message}</Paragraph>
      </Container>
    );
  }

  if (!playerData.records || !playerData.regions) {
    return (
      <Container className='text-center'>
        <Heading className='text-red'>{'No Rankings Found!'}</Heading>
        <Paragraph>{'No player rankings are found.'}</Paragraph>
      </Container>
    );
  }

  if (!tournament || !matches) return notFound();

  // make links data for the dropdown menu on the page
  const links: Links = [
    {
      id: 1,
      url: `/tournaments/${tournament.id}/statistics`,
      text: 'Tournament Statistics',
    },
    {
      id: 2,
      url: `/tournaments/${tournament.id}/statistics/pets`,
      text: 'Tournament Pets Statistics',
    },
    {
      id: 3,
      url: '/tournaments',
      text: 'Back To Tournaments',
    },
  ];

  return (
    <Container>
      <div className='mb-5'>
        <PageHeading heading={'Tournament Rankings'}>
          <ActionDropdown links={links} />
        </PageHeading>
        <Paragraph className='text-humanoid'>{tournament.name}</Paragraph>
      </div>
      {playerData.records.length > 0 ? (
        <PlayerRankings
          records={playerData.records}
          regions={playerData.regions}
        />
      ) : null}
    </Container>
  );
}
