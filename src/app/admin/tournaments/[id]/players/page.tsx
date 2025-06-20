import { redirect } from 'next/navigation';
import { getUserSession } from '@/supabase/actions/auth';
import { Container, Heading, Paragraph } from '@/components/ui';
import {
  AdminPanelButtons,
  TournamentPlayersList,
  ExportRankingsButton,
} from '@/components/admin';
import { PageParams } from '@/types';
import { getPlayerRecords } from '@/supabase/actions/players';
import { getTournamentDetails } from '@/supabase/actions/tournaments';

export async function generateMetadata() {
  return {
    title: 'Admin Players List',
    robots: { index: false, follow: false },
  };
}

export default async function AdminPlayersPage({
  params,
}: {
  params: PageParams;
}) {
  const { id } = await params;
  const response = await getUserSession();

  if (!response?.user || response?.user?.role !== 'admin') {
    redirect('/');
  }

  const {
    success,
    status,
    message,
    data: { tournament },
  } = await getTournamentDetails(id);

  const { records } = await getPlayerRecords(id);

  if (!success) {
    return (
      <Container className='text-center'>
        <Heading className='text-red'>{`Error ${status}!`}</Heading>
        <Paragraph>{message}</Paragraph>
      </Container>
    );
  }

  if (!tournament) {
    return (
      <Container className='text-center'>
        <Heading className='text-red'>{'No Tournament Found!'}</Heading>
        <Paragraph>
          {
            'Please create a tournament first, so you can upload battle logs and create matches.'
          }
        </Paragraph>
      </Container>
    );
  }

  if (!records) {
    return (
      <Container className='text-center'>
        <Heading className='text-red'>{'No Players Found!'}</Heading>
        <Paragraph>
          {
            'Please upload battle logs, so you can create matches, and get players results.'
          }
        </Paragraph>
      </Container>
    );
  }

  const username = response?.user && response?.user?.username;

  return (
    <Container>
      <Heading>{`${username}'s Admin Panel`}</Heading>
      <AdminPanelButtons isMatchesPage />
      <ExportRankingsButton
        tournamentId={id}
        tournamentName={tournament.name}
      />
      <div>
        <div className='mb-5'>
          <Heading as='h2' className='text-xl mb-2.5'>
            {'Tournament Players'}
          </Heading>
          <Paragraph className='text-humanoid'>{tournament.name}</Paragraph>
        </div>
        {records.length > 0 ? (
          <TournamentPlayersList records={records} />
        ) : (
          <Paragraph className='p-2.5 sm:p-5 rounded-lg bg-background text-center shadow-md'>
            {
              'There are no players available yet, please makes sure matches are created and battle logs are uploaded correctly.'
            }
          </Paragraph>
        )}
      </div>
    </Container>
  );
}
