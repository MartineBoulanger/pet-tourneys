import {
  BattleLogViewer,
  MatchHeading,
  MatchScore,
} from '@/components/matches';
import { Container } from '@/components/ui';
import { getMatchDetails } from '@/supabase/actions/matches';
import { MatchPageParams } from '@/types';

export default async function MatchPage({
  params,
}: {
  params: MatchPageParams;
}) {
  const { id, matchId } = await params;
  const {
    success,
    status,
    message,
    data: { match, battleLogs },
  } = await getMatchDetails(id, matchId);

  if (!success) {
    return (
      <Container className='text-center'>
        <h1 className='text-red'>{`Error ${status}!`}</h1>
        <p>{message}</p>
      </Container>
    );
  }

  return (
    <Container>
      {match && <MatchHeading match={match} tournamentId={id} />}
      {match && <MatchScore match={match} />}
      <div className='mb-10'>
        {battleLogs?.length ? (
          battleLogs.map((battle, index) => (
            <div key={battle.id} className='mb-5 lg:mb-10'>
              <h2 className='text-lg font-bold font-sans'>
                {'Battle '}
                {index + 1}
              </h2>
              <BattleLogViewer battleLog={battle} />
            </div>
          ))
        ) : (
          <p className='text-gray-500'>{'No battle logs available.'}</p>
        )}
      </div>
    </Container>
  );
}
