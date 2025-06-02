import { getTournamentsForForm } from '@/supabase/actions/tournaments';
import { UploadForm } from '@/components/admin';
import { Container, Heading, Paragraph } from '@/components/ui';
import { getTournamentTableName } from '@/utils/getTournamentTableName';
import { createClient } from '@/supabase/server';
import { MatchPageParams } from '@/types';

export async function generateMetadata() {
  return {
    title: 'Edit Match',
    robots: { index: false, follow: false },
  };
}

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

  if (!match) {
    return (
      <Container className='text-center'>
        <Heading className='text-red'>{'Match not found!'}</Heading>
      </Container>
    );
  }

  return (
    <Container className='max-w-[1024px]'>
      <Heading className='text-center'>{'Edit Match'}</Heading>
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
  );
}
