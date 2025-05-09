import { BattleLogViewer, MatchScore } from '@/components/matches';
import {
  Container,
  PageHeading,
  Heading,
  Paragraph,
  ActionDropdownItem,
} from '@/components/ui';
import { getMatchDetails } from '@/supabase/actions/matches';
import { MatchPageParams } from '@/types';
import { linksData } from '@/lib/linksData';

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
        <Heading className='text-red'>{`Error ${status}!`}</Heading>
        <Paragraph>{message}</Paragraph>
      </Container>
    );
  }

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
        className='lg:mb-5'
      >
        <div className='flex flex-col gap-2.5'>
          {linksData.match.map((link) => {
            const url = link.full_url
              ? link.full_url
              : `${link.url_prefix}${id}${
                  link.url_suffix ? link.url_suffix : ''
                }${link.url_suffix && matchId ? matchId : ''}`;
            return (
              <ActionDropdownItem
                key={link.id}
                url={url}
                text={link.text || ''}
              />
            );
          })}
        </div>
      </PageHeading>
      {match && <MatchScore match={match} />}
      <div className='mb-10'>
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
          <Paragraph className='text-gray-500'>
            {'No battle logs available.'}
          </Paragraph>
        )}
      </div>
    </Container>
  );
}
