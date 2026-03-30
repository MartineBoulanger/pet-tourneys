import { BattleLogViewer } from '@/components/leagues/BattleLogViewer';
import { MatchScore } from '@/components/leagues/MatchScore';
import { getMatchDetails } from '@/actions/supabase/api-schema/matches/getMatches';
import { Container, Heading, Paragraph } from '@/components/ui';
import { PageMenu } from '@/components/navigation/PageMenu';
import { Links } from '@/types/navigation-types';
import { MatchPageParams } from '@/types/global.types';

export async function generateMetadata({
  params,
}: {
  params: MatchPageParams;
}) {
  const { id, matchId } = await params;
  return {
    title: 'Match Details',
    description: "Pet Masters League season's match detail page",
    alternates: {
      canonical: `${process.env.BASE_URL!}/leagues/${id}/match/${matchId}`,
    },
  };
}

export default async function MatchPage({
  params,
}: {
  params: MatchPageParams;
}) {
  const { id, matchId } = await params;
  const { error, data } = await getMatchDetails(id, matchId);

  if (error) {
    return (
      <Container className='text-center'>
        <Heading className='text-red'>{'Error!'}</Heading>
        <Paragraph>{error}</Paragraph>
      </Container>
    );
  }

  // make links data for the dropdown menu on the page
  const links: Links = [
    {
      id: 1,
      url: `/leagues/${id}/statistics?matchId=${matchId}`,
      text: 'Statistics',
    },
    {
      id: 2,
      url: `/leagues/${id}/statistics/pets?matchId=${matchId}`,
      text: 'Pets Statistics',
    },
    {
      id: 3,
      url: `/leagues/${id}`,
      text: 'League Details',
    },
  ];

  return (
    <Container className='lg:px-5'>
      <Heading>
        <span className='flex gap-2.5'>
          <span>
            {data?.match?.player1} vs {data?.match?.player2}
          </span>
          <span className='text-xl text-foreground/50'>
            {data?.match?.region}
          </span>
        </span>
      </Heading>
      <PageMenu links={links} />
      {data?.match && <MatchScore match={data?.match} />}
      <div className='mb-5 lg:mb-10'>
        {data?.battleLogs?.length ? (
          data?.battleLogs.map((battle, index) => (
            <div key={battle.id} className='mb-5 lg:mb-10'>
              <Heading as='h2' className='mb-2.5'>
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
