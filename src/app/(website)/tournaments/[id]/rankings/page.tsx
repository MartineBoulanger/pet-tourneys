import { notFound } from 'next/navigation';
import { getTournamentDetails } from '@/features/supabase/actions/tournaments';
import { PlayerRankings } from '@/features/supabase/components/tournaments/PlayerRankings';
import {
  loadPetsData,
  loadPlayerData,
  PlayerRankingsData,
  PetData,
} from '@/features/supabase/utils/loadJsonData';
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

  const playerData: PlayerRankingsData = await loadPlayerData(id);
  const petData: PetData = await loadPetsData();

  // Check if data is available
  const hasPetData = Object.keys(petData).length > 0;
  const hasPlayerData =
    playerData.records.length > 0 && playerData.regions.length > 0;

  const heading = (
    <div className='mb-5'>
      <PageHeading heading={'League Rankings'}>
        <PageMenu links={links} />
      </PageHeading>
      <Paragraph className='flex justify-center text-humanoid gap-2.5 mb-5 lg:mb-10'>
        {tournament.name}
      </Paragraph>
    </div>
  );

  if (!success) {
    return (
      <Container className='text-center lg:px-5'>
        <Heading className='text-red'>{`Error ${status}!`}</Heading>
        <Paragraph>{message}</Paragraph>
      </Container>
    );
  }

  if (!hasPlayerData || !hasPetData) {
    return (
      <Container className='lg:px-5'>
        {heading}
        <Paragraph className='w-full bg-background text-center py-5 rounded-lg'>
          {'No player rankings or pet data is found.'}
        </Paragraph>
      </Container>
    );
  }

  if (!tournament || !matches) return notFound();

  return (
    <Container className='lg:px-5'>
      {heading}
      <PlayerRankings
        records={playerData.records}
        regions={playerData.regions}
        petData={petData}
      />
    </Container>
  );
}
