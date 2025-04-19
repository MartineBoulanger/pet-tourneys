import { BattleLogViewer, MatchScore } from '@/components/matches';
import { Container, PageHeading } from '@/components/ui';
import { getMatchDetails } from '@/supabase/actions/matches';
import { MatchPageParams } from '@/types';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: MatchPageParams;
}) {
  const { id, matchId } = await params;
  return {
    title: 'Tourney Match Details',
    alternates: {
      canonical: `${process.env
        .NEXT_PUBLIC_BASE_URL!}/tournaments/${id}/matches/${matchId}`,
    },
  };
}

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
      <PageHeading
        heading={
          <>
            {match.player1} vs {match.player2}{' '}
            <span className='text-xl text-gray-500'>{match.region}</span>
          </>
        }
        className='lg:mb-5'
      >
        <div className='flex flex-col gap-2.5'>
          <Link
            href={`/tournaments/${id}/statistics?matchId=${matchId}`}
            className='link'
          >
            {'View Match Pet Usage'}
          </Link>
          <div className='h-0.5 rounded-lg w-full bg-blue-grey' />
          <Link href={`/tournaments/${id}`} className='link'>
            {'Back to Tournament'}
          </Link>
        </div>
      </PageHeading>
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
