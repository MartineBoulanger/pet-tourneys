import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getUserSession } from '@/supabase/actions/auth';
import { getTournaments } from '@/supabase/actions/tournaments';
import { Container, Heading, Paragraph } from '@/components/ui';
import { TournamentsListItem, AdminPanelButtons } from '@/components/admin';

// TODO: In future maybe add pagination to the tournaments list

export const metadata: Metadata = {
  title: 'Admin Panel',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const response = await getUserSession();

  if (!response?.user || response?.user?.role !== 'admin') {
    redirect('/');
  }

  const {
    success,
    status,
    message,
    data: { tournaments },
  } = await getTournaments();

  if (!success) {
    return (
      <Container className='text-center'>
        <Heading className='text-red'>{`Error ${status}!`}</Heading>
        <Paragraph>{message}</Paragraph>
      </Container>
    );
  }

  if (!tournaments) {
    return (
      <Container className='text-center'>
        <Heading className='text-red'>{'No Tournaments Found!'}</Heading>
        <Paragraph>
          {
            'Please create a tournament first before you upload the battle logs to create matches and statistics.'
          }
        </Paragraph>
      </Container>
    );
  }

  const username = response?.user && response?.user?.username;

  return (
    <Container>
      <Heading>{`${username}'s Admin Panel`}</Heading>
      <AdminPanelButtons />
      <div>
        <Heading as='h2' className='text-xl mb-5'>
          {'Tournaments List'}
        </Heading>
        <div className='grid gap-4'>
          {tournaments.length > 0 ? (
            tournaments.map((tournament) => (
              <TournamentsListItem
                key={tournament.id}
                tournament={tournament}
              />
            ))
          ) : (
            <Paragraph className='p-4 rounded-lg bg-light-grey text-center shadow-md'>
              {
                'There are no tournaments available yet, please create a tournament.'
              }
            </Paragraph>
          )}
        </div>
      </div>
    </Container>
  );
}
