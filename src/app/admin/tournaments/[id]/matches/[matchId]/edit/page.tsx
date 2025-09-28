import { getTournamentsForForm } from '@/features/supabase/actions/tournaments';
import { UploadForm } from '@/features/supabase/components/admin/UploadForm';
import { getTournamentTableName } from '@/features/supabase/utils/getTournamentTableName';
import { createClient } from '@/features/supabase/server';
import { Container, Divider, Heading, Paragraph } from '@/components/ui';
import { MatchPageParams } from '@/types';

export default async function AdminEditMatchPage({
  params,
}: {
  params: MatchPageParams;
}) {
  const { id, matchId } = await params;
  const supabase = await createClient();
  const matchesTable = getTournamentTableName('matches', id);

  const { data: match } = await supabase
    .schema('api')
    .from(matchesTable)
    .select('*')
    .eq('id', matchId)
    .single();

  const {
    data: { tournaments },
  } = await getTournamentsForForm();

  if (!tournaments) {
    return (
      <>
        <Divider alignment='horizontal' color='light-grey' height='0.5' />
        <Container className='text-center'>
          <Heading as='h2' className='text-red mb-5'>
            {'No Leagues Found!'}
          </Heading>
          <Paragraph>
            {
              'Please create a league first before you upload the battle logs to create matches and statistics.'
            }
          </Paragraph>
        </Container>
      </>
    );
  }

  if (!match) {
    return (
      <>
        <Divider alignment='horizontal' color='light-grey' height='0.5' />
        <Container className='text-center'>
          <Heading as='h2' className='text-red mb-5'>
            {'Match not found!'}
          </Heading>
        </Container>
      </>
    );
  }

  return (
    <>
      <Divider alignment='horizontal' color='light-grey' height='0.5' />
      <Container className='px-0 lg:px-0 my-0'>
        <Heading as='h2' className='text-foreground/80 mb-5'>
          {'Edit Battle Logs & Match'}
        </Heading>
        <UploadForm
          tournaments={tournaments || []}
          initialData={{
            player1: match.player1,
            player2: match.player2,
            owner: match.owner,
            date: match.date,
            region: match.region,
            tournament_id: id,
            logs: '',
            petUsage: '',
          }}
          match_id={matchId}
          isEditMode
        />
      </Container>
    </>
  );
}
