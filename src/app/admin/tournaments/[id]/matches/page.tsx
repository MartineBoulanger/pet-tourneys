import { redirect } from 'next/navigation';
import { getUserSession } from '@/supabase/actions/auth';
import { getTournamentDetails } from '@/supabase/actions/tournaments';
import { getPaginatedMatches } from '@/supabase/actions/matches';
import { Container, Pagination } from '@/components/ui';
import { AdminPanelButtons, AdminMatchListItem } from '@/components/admin';
import { PageParams, PageSearchParams } from '@/types';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Matches List',
  robots: { index: false, follow: false },
};

export default async function AdminMatchesPage({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: PageSearchParams;
}) {
  const { id } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const MATCHES_PER_PAGE = 10;
  const offset = (currentPage - 1) * MATCHES_PER_PAGE;
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

  const {
    success: succ,
    status: stat,
    data: { matches, totalPages },
  } = await getPaginatedMatches(id, offset, MATCHES_PER_PAGE);

  if (!success || !succ) {
    return (
      <Container className='text-center'>
        <h1 className='text-red'>{`Error ${status || stat}!`}</h1>
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
          {matches && matches.length > 0 ? (
            <>
              {matches.map((match) => (
                <AdminMatchListItem
                  key={match.id}
                  match={match}
                  tournament={tournament}
                />
              ))}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  baseUrl={`/admin/tournaments/${tournament.id}/matches`}
                />
              )}
            </>
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
