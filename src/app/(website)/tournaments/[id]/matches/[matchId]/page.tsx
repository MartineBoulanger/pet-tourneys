import { BattleLogViewer, MatchScore } from '@/components/matches';
import {
  Container,
  PageHeading,
  Heading,
  Paragraph,
  ActionDropdown,
} from '@/components/ui';
import { getMatchDetails } from '@/supabase/actions/matches';
import { MatchPageParams } from '@/types';
import { Links } from '@/lib/types';

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
      text: 'Match Statistics',
    },
    {
      id: 2,
      url: `/tournaments/${id}/statistics/pet-stats?matchId=${matchId}`,
      text: 'Match Pets Statistics',
    },
    {
      id: 3,
      url: `/tournaments/${id}`,
      text: 'Back To Tournament',
    },
  ];

  return (
    <Container>
      <PageHeading
        heading={
          <span className='flex gap-2.5'>
            <span>
              {match.player1} vs {match.player2}
            </span>
            <span className='text-xl text-foreground/50'>{match.region}</span>
          </span>
        }
        className='sm:mb-5'
      >
        <ActionDropdown links={links} />
      </PageHeading>
      {match && <MatchScore match={match} />}
      <div className='mb-5 sm:mb-10'>
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
          <Paragraph className='p-2.5 sm:p-5 rounded-lg bg-background text-center shadow-md'>
            {'No battle logs available.'}
          </Paragraph>
        )}
      </div>
    </Container>
  );
}
