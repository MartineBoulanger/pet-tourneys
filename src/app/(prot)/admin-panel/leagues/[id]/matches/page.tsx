import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';
import { Container, Heading, Paragraph } from '@/components/ui';
import { PageParams, PageSearchParams } from '@/types/global.types';
import { getLeagueDetails } from '@/actions/supabase/api-schema/leagues/getLeagues';
import { getPaginatedMatches } from '@/actions/supabase/api-schema/matches/getMatches';
import { Pagination } from '@/components/layout/Pagination';
import { MatchItem } from '@/components/admin-panel/league-management/MatchItem';

const MATCHES_PER_PAGE = 10;

export default async function AdminLeagueMatchesPage({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: PageSearchParams;
}) {
  const { id } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const offset = (currentPage - 1) * MATCHES_PER_PAGE;

  const { error, data } = await getLeagueDetails(id);

  const {
    error: err,
    data: matches,
    totalPages,
  } = await getPaginatedMatches(id, offset, MATCHES_PER_PAGE, true);

  if (error || err) {
    <Container className='text-center'>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <Heading as='h2' className='text-red mb-5'>{`Error!`}</Heading>
      <Paragraph>{error}</Paragraph>
    </Container>;
  }

  if (!data?.league) {
    <Container className='text-center'>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <Heading as='h2' className='text-red mb-5'>
        {'No League Found!'}
      </Heading>
      <Paragraph>
        {
          'Please create a league first, so you can upload battle logs and create matches.'
        }
      </Paragraph>
    </Container>;
  }

  if (!matches) {
    <Container className='text-center'>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <Heading as='h2' className='text-red mb-5'>
        {'No Matches Found!'}
      </Heading>
      <Paragraph>
        {'Please upload battle logs, so you can create matches.'}
      </Paragraph>
    </Container>;
  }

  return (
    <Container className='px-0 lg:px-0'>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <Heading as='h2' className='mb-5 font-brutals-normal mx-auto'>
        {'Manage League Matches'}
      </Heading>
      <Paragraph className='text-foreground/50 text-center mb-2.5'>
        {'Manage all the league matches here.'}
      </Paragraph>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <div className='flex flex-wrap item-center justify-center gap-2.5 mb-2.5'>
        <Link
          href='/admin-panel/leagues/upload-logs'
          className='btn-submit flex items-center gap-2.5 py-[7px] px-[11px] rounded-lg'
        >
          <FaPlus className='w-5 h-5' /> <span>{'Create New Match'}</span>
        </Link>
      </div>
      <div className='grid gap-2.5 bg-light-grey p-2.5 lg:p-5 rounded-lg shadow-md'>
        {matches && matches.length > 0 ? (
          <>
            {matches?.map((match) => (
              <MatchItem
                key={match.id}
                match={match}
                league={data?.league ?? null}
              />
            ))}
            {totalPages > 1 ? (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl={`/admin-panel/leagues/${id}/matches`}
              />
            ) : null}
          </>
        ) : (
          <Paragraph className='p-2.5 lg:p-5 rounded-lg bg-background text-center shadow-md'>
            {
              'There are no matches for this league yet, please upload some battle logs to see the matches here.'
            }
          </Paragraph>
        )}
      </div>
    </Container>
  );
}
