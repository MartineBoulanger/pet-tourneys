import { Container, Heading, Paragraph } from '@/components/ui';
import { MatchPageParams } from '@/types/global.types';
import { getLeaguesForForm } from '@/actions/supabase/api-schema/leagues/getLeagues';
import { getMatch } from '@/actions/supabase/api-schema/matches/getMatches';
import { UploadForm } from '@/components/admin-panel/league-management/UploadForm';

export default async function AdminLeagueMatchesPage({
  params,
}: {
  params: MatchPageParams;
}) {
  const { id, matchId } = await params;

  const { data: match, error: err } = await getMatch(id, matchId);
  const { error, data } = await getLeaguesForForm();

  if (error || err) {
    <Container className='text-center'>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <Heading as='h2' className='text-red mb-5'>{`Error!`}</Heading>
      <Paragraph>{error}</Paragraph>
    </Container>;
  }

  if (!match) {
    <Container className='text-center'>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <Heading as='h2' className='text-red mb-5'>
        {'Match not found!'}
      </Heading>
      <Paragraph>
        {'Please create the match first before trying to edit it.'}
      </Paragraph>
    </Container>;
  }

  if (!data) {
    <Container className='text-center'>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <Heading as='h2' className='text-red mb-5'>
        {'No Leagues Found!'}
      </Heading>
      <Paragraph>
        {
          'Please create a league first before you upload the battle logs to create matches and statistics.'
        }
      </Paragraph>
    </Container>;
  }

  return (
    <Container className='px-0 lg:px-0'>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <Heading as='h2' className='mb-5 font-brutals-normal mx-auto'>
        {`Edit ${match?.player1} vs ${match?.player2} Match`}
      </Heading>
      <Paragraph className='text-foreground/50 text-center mb-2.5'>
        {'Edit the battle logs, pet usage, and match information.'}
      </Paragraph>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <UploadForm
        leagues={data || []}
        initialData={{
          player1: match?.player1 || '',
          player2: match?.player2 || '',
          owner: match?.owner || '',
          date: match?.date || '',
          region: match?.region || '',
          tournament_id: id,
          logs: '',
          petUsage: '',
        }}
        match_id={matchId}
        isEditMode
      />
    </Container>
  );
}
