import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';
import { Container, Heading, Paragraph } from '@/components/ui';
import { PageSearchParams } from '@/types/global.types';
import { getLeagues } from '@/actions/supabase/api-schema/leagues/getLeagues';
import { Pagination } from '@/components/layout/Pagination';
import { LeagueItem } from '@/components/admin-panel/league-management/LeagueItem';

const TOURNAMENTS_PER_PAGE = 12;

export default async function AdminTournamentsPage({
  searchParams,
}: {
  searchParams: PageSearchParams;
}) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const offset = (currentPage - 1) * TOURNAMENTS_PER_PAGE;

  const { error, data, totalPages } = await getLeagues(
    offset,
    TOURNAMENTS_PER_PAGE,
  );

  if (error) {
    <Container className='text-center'>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <Heading as='h2' className='text-red mb-5'>{`Error!`}</Heading>
      <Paragraph>{error}</Paragraph>
    </Container>;
  }

  if (!data) {
    <Container className='text-center'>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <Heading as='h2' className='text-red mb-5'>
        {'No Leagues Found!'}
      </Heading>
      <Paragraph>
        {
          'Please create a league first before you upload the battle logs to create matches and statistics.'
        }
      </Paragraph>
    </Container>;
  }

  return (
    <Container className='px-0 lg:px-0'>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <Heading as='h2' className='mb-5 font-brutals-normal mx-auto'>
        {'Manage Leagues'}
      </Heading>
      <Paragraph className='text-foreground/50 text-center mb-2.5'>
        {'Manage all PML leagues'}
      </Paragraph>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <div className='flex flex-wrap item-center justify-center gap-2.5 mb-2.5'>
        <Link
          href='/admin-panel/leagues/new'
          className='btn-submit flex items-center gap-2.5 py-[7px] px-[11px] rounded-lg'
        >
          <FaPlus className='w-4 h-4' />
          <span className='uppercase'>{'Create League'}</span>
        </Link>
      </div>
      <div className='grid gap-2.5 bg-light-grey p-2.5 lg:p-5 rounded-lg shadow-md'>
        {data && data.length > 0 ? (
          <>
            {data.map((league) => (
              <LeagueItem key={league.id} league={league} />
            ))}
            {totalPages && totalPages > 1 ? (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl={'/admin-panel/leagues'}
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
  );
}
