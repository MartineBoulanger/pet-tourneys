import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';
import { MdUpload } from 'react-icons/md';
import { TournamentsListItem } from '@/features/supabase/components/admin/tournaments/TournamentsListItem';
import {
  Container,
  Heading,
  Paragraph,
  Pagination,
  Divider,
} from '@/components/ui';
import { PageSearchParams } from '@/types';
import { TOURNAMENTS_PER_PAGE } from '@/features/supabase/constants';
import { getTournaments } from '@/features/supabase/actions/tournaments';

export default async function AdminTournamentsListPage({
  searchParams,
}: {
  searchParams: PageSearchParams;
}) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const offset = (currentPage - 1) * TOURNAMENTS_PER_PAGE;

  const {
    success,
    status,
    message,
    data: { tournaments, totalPages },
  } = await getTournaments(offset, TOURNAMENTS_PER_PAGE);

  if (!success) {
    return (
      <>
        <Divider alignment='horizontal' color='light-grey' height='0.5' />
        <Container className='text-center'>
          <Heading
            as='h2'
            className='font-sans tracking-normal text-xl text-red mb-2.5'
          >{`Error ${status}!`}</Heading>
          <Paragraph>{message}</Paragraph>
        </Container>
      </>
    );
  }

  if (!tournaments) {
    return (
      <>
        <Divider alignment='horizontal' color='light-grey' height='0.5' />
        <Container className='text-center'>
          <Heading
            as='h2'
            className='font-sans tracking-normal text-xl text-red mb-2.5'
          >
            {'No Leagues Found!'}
          </Heading>
          <Paragraph>
            {
              'Please create a league first before you upload the battle logs to create matches and statistics.'
            }
          </Paragraph>
        </Container>
      </>
    );
  }

  return (
    <>
      <Divider alignment='horizontal' color='light-grey' height='0.5' />
      <Container className='px-0 lg:px-0'>
        <Heading as='h2' className='font-sans tracking-normal text-xl mb-2.5'>
          {'Manage Leagues'}
        </Heading>
        <div className='flex flex-wrap item-center justify-center gap-2.5 lg:gap-5 mb-2.5 lg:mb-5'>
          <Link
            href='/admin/tournaments/new'
            className='btn-submit flex items-center gap-2.5 py-[7px] px-[11px] rounded-lg'
          >
            <FaPlus className='w-4 h-4' /> <span>{'Create League'}</span>
          </Link>
          <Link
            href='/admin/upload-logs'
            className='btn-submit flex items-center gap-2.5 py-[7px] px-[11px] rounded-lg'
          >
            <MdUpload className='w-5 h-5' /> <span>{'Upload Battle Logs'}</span>
          </Link>
        </div>
        <div className='grid gap-2.5 lg:gap-5 bg-light-grey p-2.5 lg:p-5 rounded-lg shadow-md'>
          {tournaments.length > 0 ? (
            <>
              {tournaments.map((tournament) => (
                <TournamentsListItem
                  key={tournament.id}
                  tournament={tournament}
                />
              ))}
              {totalPages > 1 ? (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  baseUrl={'/admin'}
                />
              ) : null}
            </>
          ) : (
            <Paragraph className='p-2.5 lg:p-5 rounded-lg bg-background text-center shadow-md'>
              {'There are no leagues available yet, please create a league.'}
            </Paragraph>
          )}
        </div>
      </Container>
    </>
  );
}
