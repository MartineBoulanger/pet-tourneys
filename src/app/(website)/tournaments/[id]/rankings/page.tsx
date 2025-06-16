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
  const records = await getPlayerRecords(id);

  if (!success) {
    return (
      <Container className='text-center'>
        <Heading className='text-red'>{`Error ${status}!`}</Heading>
        <Paragraph>{message}</Paragraph>
      </Container>
    );
  }

  if (!records) {
    return (
      <Container className='text-center'>
        <Heading className='text-red'>{'No Rankings Found!'}</Heading>
        <Paragraph>{'No player rankings found.'}</Paragraph>
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
      {records.length > 0 ? <PlayerRankings records={records} /> : null}
    </Container>
  );
}
