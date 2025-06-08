import { redirect } from 'next/navigation';
import { getUserSession } from '@/supabase/actions/auth';
import { getTournaments } from '@/supabase/actions/tournaments';
import { Container, Heading, Paragraph, Pagination } from '@/components/ui';
import { TournamentsListItem, AdminPanelButtons } from '@/components/admin';
import { PageSearchParams } from '@/types';
import { TOURNAMENTS_PER_PAGE } from '@/utils/constants';

export async function generateMetadata() {
  return {
    title: 'Admin Panel',
    robots: { index: false, follow: false },
  };
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: PageSearchParams;
}) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const offset = (currentPage - 1) * TOURNAMENTS_PER_PAGE;

  const response = await getUserSession();

  if (!response?.user || response?.user?.role !== 'admin') {
    redirect('/');
  }

  const {
    success,
    status,
    message,
    data: { tournaments, totalPages },
  } = await getTournaments(offset, TOURNAMENTS_PER_PAGE);

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
        <Heading as='h2' className='text-xl mb-2.5'>
          {'Tournaments List'}
        </Heading>
        <div className='grid gap-2.5 sm:gap-5 bg-light-grey p-2.5 sm:p-5 rounded-lg shadow-md'>
          {tournaments.length > 0 ? (
            <>
              {tournaments.map((tournament) => (
                <TournamentsListItem
                  key={tournament.id}
                  tournament={tournament}
                />
              ))}
              {totalPages > 1 ? (
                <Pagination
                  className='mt-2.5'
                  currentPage={currentPage}
                  totalPages={totalPages}
                  baseUrl={'/admin'}
                />
              ) : null}
            </>
          ) : (
            <Paragraph className='p-2.5 sm:p-5 rounded-lg bg-background text-center shadow-md'>
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
