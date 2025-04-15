import { getTournaments } from '@/supabase/actions/tournaments';
import { UploadForm } from '@/components/admin';
import { Container } from '@/components/ui';
import { getTournamentTableName } from '@/utils/getTournamentTableName';
import { createClient } from '@/supabase/server';
import { MatchPageParams } from '@/types';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Match',
  robots: { index: false, follow: false },
};

export default async function AdminEditMatchPage({
  params,
}: {
  params: MatchPageParams;
}) {
  const { id, matchId } = await params;
  const supabase = await createClient();
  const matchesTable = getTournamentTableName('matches', id);

  // Fetch existing match data
  const { data: match } = await supabase
    .schema('api')
    .from(matchesTable)
    .select('*')
    .eq('id', matchId)
    .single();

  const {
    data: { tournaments },
  } = await getTournaments();

  if (!tournaments) {
    return (
      <Container className='text-center'>
        <h1 className='text-red'>{'No Tournaments Found!'}</h1>
        <p>
          {
            'Please create a tournament first before you upload the battle logs to create matches and statistics.'
          }
        </p>
      </Container>
    );
  }

  if (!match) {
    return (
      <Container className='text-center'>
        <h1 className='text-red'>{'Match not found!'}</h1>
      </Container>
    );
  }

  return (
    <Container className='max-w-[1024px]'>
      <h1 className='text-center'>{'Edit Match'}</h1>
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
