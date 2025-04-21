import { redirect } from 'next/navigation';
import { getUserSession } from '@/supabase/actions/auth';
import { getTournaments } from '@/supabase/actions/tournaments';
import { Container } from '@/components/ui';
import { TournamentsListItem, AdminPanelButtons } from '@/components/admin';
import { Metadata } from 'next';

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
        <h1 className='text-red'>{`Error ${status}!`}</h1>
        <p>{message}</p>
      </Container>
    );
  }

  if (!tournaments) {
    return (
      <Container className='text-center'>
        <h1 className='text-red'>{'No Tournaments Found!'}</h1>
        <p>
          {
            'Please create a tournament first before you upload the battle logs to create matches and statistics.'
          }
        </p>
      </Container>
    );
  }

  const username = response?.user && response?.user?.username;

  return (
    <Container>
      <h1>{`${username}'s Admin Panel`}</h1>
      <AdminPanelButtons />
      <div>
        <h2 className='text-xl mb-5'>{'Tournaments List'}</h2>
        <div className='grid gap-4'>
          {tournaments.length > 0 ? (
            tournaments.map((tournament) => (
              <TournamentsListItem
                key={tournament.id}
                tournament={tournament}
              />
            ))
          ) : (
            <p className='p-4 rounded-lg bg-light-grey text-center shadow-md'>
              {
                'There are no tournaments available yet, please create a tournament.'
              }
            </p>
          )}
        </div>
      </div>
    </Container>
  );
}
