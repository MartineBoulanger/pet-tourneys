import { redirect } from 'next/navigation';
import { getUserSession } from '@/supabase/actions/auth';
import { Container, Heading } from '@/components/ui';
import { AdminPanelButtons, TournamentOutcome } from '@/components/admin';
import { PageParams } from '@/types';
import { getPlayerRecords } from '@/supabase/actions/outcome-data';

export async function generateMetadata() {
  return {
    title: 'Admin Matches List',
    robots: { index: false, follow: false },
  };
}

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

  const username = response?.user && response?.user?.username;

  const records = await getPlayerRecords(id);

  return (
    <Container>
      <Heading>{`${username}'s Admin Panel`}</Heading>
      <AdminPanelButtons isMatchesPage />
      <div>
        <div className='mb-5'>
          <Heading as='h2' className='text-xl mb-2.5'>
            {'Tournament Outcome Results'}
          </Heading>
        </div>
        {/* <div className='grid gap-2.5 sm:gap-5 bg-light-grey p-2.5 sm:p-5 rounded-lg shadow-md'> */}
        {records && <TournamentOutcome records={records} />}
        {/* </div> */}
      </div>
    </Container>
  );
}
