import { redirect } from 'next/navigation';
import { getUserSession } from '@/supabase/actions/auth';
import { getTournamentDetails } from '@/supabase/actions/tournaments';
import { Container } from '@/components/ui';
import { AdminPanelButtons, AdminMatchListItem } from '@/components/admin';
import { PageParams } from '@/types';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Matches List',
  robots: { index: false, follow: false },
};

export default async function AdminMatchesPage({
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
    data: { tournament, matches },
  } = await getTournamentDetails(id);

  if (!success) {
    return (
      <Container className='text-center'>
        <h1 className='text-red'>{`Error ${status}!`}</h1>
        <p>{message}</p>
      </Container>
    );
  }

  if (!tournament) {
    return (
      <Container className='text-center'>
        <h1 className='text-red'>{'No Tournament Found!'}</h1>
        <p>
          {
            'Please create a tournament first, so you can upload battle logs and create matches.'
          }
        </p>
      </Container>
    );
  }

  if (!matches) {
    return (
      <Container className='text-center'>
        <h1 className='text-red'>{'No Matches Found!'}</h1>
        <p>{'Please upload battle logs, so you can create matches.'}</p>
      </Container>
    );
  }

  return (
    <Container>
      <h1>{'Admin Panel'}</h1>
      <AdminPanelButtons />
      <div>
        <div className='mb-5'>
          <h2 className='text-xl mb-2'>{'Tournament Matches'}</h2>
          <p className='text-gray-500'>{tournament.name}</p>
        </div>
        <div className='grid gap-4'>
          {matches.length > 0 ? (
            matches.map((match) => (
              <AdminMatchListItem
                key={match.id}
                match={match}
                tournament={tournament}
              />
            ))
          ) : (
            <p className='p-4 rounded-lg bg-light-grey text-center shadow-md'>
              {
                'There are no matches for this tournament yet, please upload some battle logs.'
              }
            </p>
          )}
        </div>
      </div>
    </Container>
  );
}
