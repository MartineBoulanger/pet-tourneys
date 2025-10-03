import Link from 'next/link';
import { MdUpload } from 'react-icons/md';
import { getTournamentDetails } from '@/features/supabase/actions/tournaments';
import { getPaginatedMatches } from '@/features/supabase/actions/matches';
import { AdminMatchListItem } from '@/features/supabase/components/admin/matches/AdminMatchListItem';
import { MATCHES_PER_PAGE } from '@/utils/constants';
import {
  Container,
  Pagination,
  Heading,
  Paragraph,
  Divider,
} from '@/components/ui';
import { PageParams, PageSearchParams } from '@/types';

export default async function AdminMatchesPage({
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

  const {
    success,
    status,
    message,
    data: { tournament },
  } = await getTournamentDetails(id);

  const {
    success: succ,
    status: stat,
    data: { matches, totalPages },
  } = await getPaginatedMatches(id, offset, MATCHES_PER_PAGE);

  if (!success || !succ) {
    return (
      <>
        <Divider alignment='horizontal' color='light-grey' height='0.5' />
        <Container className='text-center lg:px-5'>
          <Heading as='h2' className='text-red mb-5'>{`Error ${
            status || stat
          }!`}</Heading>
          <Paragraph>{message}</Paragraph>
        </Container>
      </>
    );
  }

  if (!tournament) {
    return (
      <>
        <Divider alignment='horizontal' color='light-grey' height='0.5' />
        <Container className='text-center lg:px-5'>
          <Heading as='h2' className='text-red mb-5'>
            {'No League Found!'}
          </Heading>
          <Paragraph>
            {
              'Please create a league first, so you can upload battle logs and create matches.'
            }
          </Paragraph>
        </Container>
      </>
    );
  }

  if (!matches) {
    return (
      <>
        <Divider alignment='horizontal' color='light-grey' height='0.5' />
        <Container className='text-center lg:px-5'>
          <Heading as='h2' className='text-red mb-5'>
            {'No Matches Found!'}
          </Heading>
          <Paragraph>
            {'Please upload battle logs, so you can create matches.'}
          </Paragraph>
        </Container>
      </>
    );
  }

  return (
    <>
      <Divider alignment='horizontal' color='light-grey' height='0.5' />
      <Container className='px-0 lg:px-0 my-0'>
        <div className='mb-5'>
          <Heading as='h2' className='text-foreground/80 mb-5'>
            {'Manage League Matches'}
          </Heading>
          <Paragraph className='text-humanoid text-center mb-2.5'>
            {tournament.name}
          </Paragraph>
        </div>
        <div className='flex flex-wrap item-center justify-center gap-2.5 mb-2.5'>
          <Link
            href='/admin/upload-logs'
            className='btn-submit flex items-center gap-2.5 py-[7px] px-[11px] rounded-lg'
          >
            <MdUpload className='w-5 h-5' /> <span>{'Upload Battle Logs'}</span>
          </Link>
        </div>
        <div className='grid gap-2.5 bg-light-grey p-2.5 lg:p-5 rounded-lg shadow-md'>
          {matches && matches.length > 0 ? (
            <>
              {matches.map((match) => (
                <AdminMatchListItem
                  key={match.id}
                  match={match}
                  tournament={tournament}
                />
              ))}
              {totalPages > 1 ? (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  baseUrl={`/admin/tournaments/${tournament.id}/matches`}
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
    </>
  );
}
