import { Container, Divider, Heading, Paragraph } from '@/components/ui';
import { TournamentPlayersList } from '@/components/admin/tournaments/TournamentPlayersList';
import { ExportRankingsButton } from '@/components/admin/tournaments/ExportRankingsButton';
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

  const {
    success,
    status,
    message,
    data: { tournament },
  } = await getTournamentDetails(id);

  const { records } = await getPlayerRecords(id);

  if (!success) {
    return (
      <>
        <Divider alignment='horizontal' color='light-grey' height='0.5' />
        <Container className='text-center'>
          <Heading className='text-red'>{`Error ${status}!`}</Heading>
          <Paragraph>{message}</Paragraph>
        </Container>
      </>
    );
  }

  if (!tournament) {
    return (
      <>
        <Divider alignment='horizontal' color='light-grey' height='0.5' />
        <Container className='text-center'>
          <Heading className='text-red'>{'No League Found!'}</Heading>
          <Paragraph>
            {
              'Please create a league first, so you can upload battle logs and create matches.'
            }
          </Paragraph>
        </Container>
      </>
    );
  }

  if (!records) {
    return (
      <>
        <Divider alignment='horizontal' color='light-grey' height='0.5' />
        <Container className='text-center'>
          <Heading className='text-red'>{'No Players Found!'}</Heading>
          <Paragraph>
            {
              'Please upload battle logs, so you can create matches, and get players results.'
            }
          </Paragraph>
        </Container>
      </>
    );
  }

  return (
    <>
      <Divider alignment='horizontal' color='light-grey' height='0.5' />
      <Container className='px-0 lg:px-0'>
        <div>
          <div className='mb-5'>
            <Heading as='h2' className='font-sans tracking-normal text-xl'>
              {'Manage League Players'}
            </Heading>
            <Paragraph className='text-humanoid'>{tournament.name}</Paragraph>
          </div>
          <div className='flex flex-wrap item-center justify-center gap-2.5 lg:gap-5 mb-2.5 lg:mb-5'>
            <ExportRankingsButton
              tournamentId={id}
              tournamentName={tournament.name}
            />
          </div>
          {records.length > 0 ? (
            <TournamentPlayersList records={records} />
          ) : (
            <Paragraph className='p-2.5 lg:p-5 rounded-lg bg-background text-center shadow-md'>
              {
                'There are no players available yet, please makes sure matches are created and battle logs are uploaded correctly.'
              }
            </Paragraph>
          )}
        </div>
      </Container>
    </>
  );
}
