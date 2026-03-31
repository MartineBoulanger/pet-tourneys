import { Container, Heading, Paragraph } from '@/components/ui';
import { LeaguePlayersList } from '@/components/admin-panel/league-management/LeaguePlayersList';
import { ExportButton } from '@/components/admin-panel/league-management/ExportButton';
import { getPlayerRecords } from '@/actions/supabase/api-schema/matches/getPlayers';
import { getLeagueDetails } from '@/actions/supabase/api-schema/leagues/getLeagues';
import { PageParams } from '@/types/global.types';

export default async function AdminLeaguePlayersPage({
  params,
}: {
  params: PageParams;
}) {
  const { id } = await params;

  const { error, data } = await getLeagueDetails(id);
  const { records } = await getPlayerRecords(id);

  if (error) {
    <Container className='text-center'>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <Heading as='h2' className='text-red mb-5'>{`Error!`}</Heading>
      <Paragraph>{error}</Paragraph>
    </Container>;
  }

  if (!data?.league) {
    return (
      <Container className='text-center'>
        <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
        <Heading as='h2' className='text-red mb-5'>
          {'No League Found!'}
        </Heading>
        <Paragraph>
          {
            'Please create a league first, so you can upload battle logs and create matches.'
          }
        </Paragraph>
      </Container>
    );
  }

  if (!records) {
    return (
      <Container className='text-center'>
        <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
        <Heading as='h2' className='text-red mb-5'>
          {'No Players Found!'}
        </Heading>
        <Paragraph>
          {
            'Please upload battle logs, so you can create matches, and get players results.'
          }
        </Paragraph>
      </Container>
    );
  }

  return (
    <Container className='px-0 lg:px-0 my-0'>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <Heading as='h2' className='mb-5 font-brutals-normal mx-auto'>
        {'Manage League Players'}
      </Heading>
      <Paragraph className='text-foreground/50 text-center mb-2.5'>
        {`Manage ${data.league.name} players`}
      </Paragraph>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <div className='flex flex-wrap item-center justify-center gap-2.5 mb-2.5'>
        <ExportButton id={id} name={data.league.name} />
      </div>
      <div className='p-2.5 lg:p-5 rounded-lg bg-light-grey'>
        {records.length > 0 ? (
          <LeaguePlayersList records={records} />
        ) : (
          <Paragraph className='p-2.5 lg:p-5 rounded-lg bg-background text-center shadow-md'>
            {
              'There are no players available yet, please makes sure matches are created and battle logs are uploaded correctly.'
            }
          </Paragraph>
        )}
      </div>
    </Container>
  );
}
