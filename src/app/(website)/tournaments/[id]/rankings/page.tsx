import { notFound } from 'next/navigation';
import { getTournamentDetails } from '@/features/supabase/actions/tournaments';
import { PlayerRankings } from '@/features/supabase/components/tournaments/PlayerRankings';
import {
  loadPetsData,
  loadPlayerData,
} from '@/features/supabase/utils/loadJsonData';
import { Pet } from '@/features/supabase/components/statistics/types';
import {
  Container,
  PageHeading,
  Heading,
  Paragraph,
  PageMenu,
} from '@/components/ui';
import { Links } from '@/lib/types';
import { PageParams } from '@/types';

export async function generateMetadata({ params }: { params: PageParams }) {
  const { id } = await params;
  return {
    title: 'League Rankings',
    alternates: {
      canonical: `${process.env.BASE_URL!}/tournaments/${id}/rankings`,
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
      <Container className='text-center lg:px-5'>
        <Heading className='text-red'>{`Error ${status}!`}</Heading>
        <Paragraph>{message}</Paragraph>
      </Container>
    );
  }

  if (!playerData.records || !playerData.regions) {
    return (
      <Container className='text-center lg:px-5'>
        <Heading className='text-red'>{'No Rankings Found!'}</Heading>
        <Paragraph>{'No player rankings are found.'}</Paragraph>
      </Container>
    );
  }

  if (!tournament || !matches) return notFound();

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
      text: 'Back To League Details',
    },
  ];

  return (
    <Container className='lg:px-5'>
      <div className='mb-5'>
        <PageHeading heading={'League Rankings'}>
          <PageMenu links={links} />
        </PageHeading>
        <Paragraph className='text-humanoid'>{tournament.name}</Paragraph>
      </div>
      <PlayerRankings
        records={playerData.records}
        regions={playerData.regions}
        petData={petData}
      />
    </Container>
  );
}
