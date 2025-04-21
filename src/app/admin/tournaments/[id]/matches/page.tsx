import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getUserSession } from '@/supabase/actions/auth';
import { getTournamentDetails } from '@/supabase/actions/tournaments';
import { getPaginatedMatches } from '@/supabase/actions/matches';
import { Container, Pagination, Heading, Paragraph } from '@/components/ui';
import { AdminPanelButtons, AdminMatchListItem } from '@/components/admin';
import { PageParams, PageSearchParams } from '@/types';
import { MATCHES_PER_PAGE } from '@/types/constants';

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
        <Heading className='text-red'>{`Error ${status || stat}!`}</Heading>
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

  if (!matches) {
    return (
      <Container className='text-center'>
        <Heading className='text-red'>{'No Matches Found!'}</Heading>
        <Paragraph>
          {'Please upload battle logs, so you can create matches.'}
        </Paragraph>
      </Container>
    );
  }

  const username = response?.user && response?.user?.username;

  return (
    <Container>
      <Heading>{`${username}'s Admin Panel`}</Heading>
      <AdminPanelButtons isMatchesPage />
      <div>
        <div className='mb-5'>
          <Heading as='h2' className='text-xl mb-2'>
            {'Tournament Matches'}
          </Heading>
          <Paragraph className='text-light-blue'>{tournament.name}</Paragraph>
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
            <Paragraph className='p-4 rounded-lg bg-light-grey text-center shadow-md'>
              {
                'There are no matches for this tournament yet, please upload some battle logs.'
              }
            </Paragraph>
          )}
        </div>
      </div>
    </Container>
  );
}
