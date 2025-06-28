import { notFound } from 'next/navigation';
import { getTournamentDetails } from '@/supabase/actions/tournaments';
import {
  Container,
  PageHeading,
  Heading,
  Paragraph,
  PageMenu,
} from '@/components/ui';
import { PageParams } from '@/types';
import { Links } from '@/lib/types';
import { PlayerRankings } from '@/components/tournaments';
import { loadPetsData, loadPlayerData } from '@/utils/loadJsonData';
import { Pet } from '@/components/statistics/types';

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

export default async function RankingsPage({ params }: { params: PageParams }) {
  const { id } = await params;

  const {
    success,
    status,
    message,
    data: { tournament, matches },
  } = await getTournamentDetails(id);

  const playerData = await loadPlayerData(id);
  const petData: Pet[] = await loadPetsData();

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

  // const isOnGoing =
  //   tournament.end_date === '1999-12-31T22:00:00' ||
  //   tournament.end_date === null;

  // make links data for the dropdown menu on the page
  const links: Links = [
    {
      id: 1,
      url: `/tournaments/${tournament.id}/statistics`,
      text: 'Statistics',
    },
    {
      id: 2,
      url: `/tournaments/${tournament.id}/statistics/pets`,
      text: 'Pets Statistics',
    },
    {
      id: 3,
      url: `/tournaments/${tournament.id}`,
      text: 'Back To Tournament Details',
    },
  ];

  return (
    <Container>
      <div className='mb-5'>
        <PageHeading heading={'Tournament Rankings'}>
          <PageMenu links={links} />
        </PageHeading>
        <Paragraph className='text-humanoid'>{tournament.name}</Paragraph>
      </div>
      {/* {isOnGoing ? (
        <Paragraph className='p-2.5 sm:p-5 rounded-lg bg-background text-center shadow-md'>
          {
            'The tournament is still ongoing, come back to check the rankings when the tournament is finished.'
          }
        </Paragraph>
      ) : ( */}
      <PlayerRankings
        records={playerData.records}
        regions={playerData.regions}
        petData={petData}
      />
      {/* )} */}
    </Container>
  );
}
