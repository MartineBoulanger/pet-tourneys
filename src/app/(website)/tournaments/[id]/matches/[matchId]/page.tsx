import { BattleLogViewer } from '@/features/supabase/components/matches/BattleLogViewer';
import { MatchScore } from '@/features/supabase/components/matches/MatchScore';
import { getMatchDetails } from '@/features/supabase/actions/matches';
import {
  Container,
  PageHeading,
  Heading,
  Paragraph,
  PageMenu,
} from '@/components/ui';
import { Links } from '@/lib/types';
import { MatchPageParams } from '@/types';

export async function generateMetadata({
  params,
}: {
  params: MatchPageParams;
}) {
  const { id, matchId } = await params;
  return {
    title: 'Match Details',
    alternates: {
      canonical: `${process.env
        .BASE_URL!}/tournaments/${id}/matches/${matchId}`,
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
      <Container className='text-center lg:px-5'>
        <Heading className='text-red'>{`Error ${status}!`}</Heading>
        <Paragraph>{message}</Paragraph>
      </Container>
    );
  }

  // make links data for the dropdown menu on the page
  const links: Links = [
    {
      id: 1,
      url: `/tournaments/${id}/statistics?matchId=${matchId}`,
      text: 'Statistics',
    },
    {
      id: 2,
      url: `/tournaments/${id}/statistics/pets?matchId=${matchId}`,
      text: 'Pets Statistics',
    },
    {
      id: 3,
      url: `/tournaments/${id}`,
      text: 'Back To League Details',
    },
  ];

  return (
    <Container className='lg:px-5'>
      <PageHeading
        heading={
          <span className='flex gap-2.5'>
            <span>
              {match.player1} vs {match.player2}
            </span>
            <span className='text-xl text-foreground/50'>{match.region}</span>
          </span>
        }
        className='lg:mb-5'
      >
        <PageMenu links={links} />
      </PageHeading>
      {match && <MatchScore match={match} />}
      <div className='mb-5 lg:mb-10'>
        {battleLogs?.length ? (
          battleLogs.map((battle, index) => (
            <div key={battle.id} className='mb-5 lg:mb-10'>
              <Heading as='h2' className='text-lg font-bold font-sans'>
                {'Battle '}
                {index + 1}
              </Heading>
              <BattleLogViewer battleLog={battle} />
            </div>
          ))
        ) : (
          <Paragraph className='p-2.5 lg:p-5 rounded-lg bg-background text-center shadow-md'>
            {'No battle logs available.'}
          </Paragraph>
        )}
      </div>
    </Container>
  );
}
