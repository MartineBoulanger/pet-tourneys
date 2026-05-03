import { notFound } from 'next/navigation';
import { getLeagueDetails } from '@/actions/supabase/api-schema/leagues/getLeagues';
import { getPaginatedMatches } from '@/actions/supabase/api-schema/matches/getMatches';
import { MatchList } from '@/components/leagues/MatchList';
import { Container, Heading, Paragraph } from '@/components/ui';
import { PageParams, PageSearchParams } from '@/types/global.types';
import { Links } from '@/types/navigation-types';
import { PageMenu } from '@/components/navigation/PageMenu';
import { DownloadLeagueUsedPetsButton } from '@/components/layout';

export async function generateMetadata({ params }: { params: PageParams }) {
  const { id } = await params;
  return {
    title: 'League Details',
    description: "Pet Masters League season's detail page",
    alternates: {
      canonical: `${process.env.BASE_URL!}/leagues/${id}`,
    },
  };
}

const MATCHES_PER_PAGE = 24;

export default async function LeagueDetailsPage({
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
  } = await getPaginatedMatches(id, offset, MATCHES_PER_PAGE);

  if (error || err) {
    return (
      <Container className='text-center'>
        <Heading className='text-red'>{'Error!'}</Heading>
        <Paragraph>{error || err}</Paragraph>
      </Container>
    );
  }

  if (!data?.league || !matches) return notFound();

  const links: Links = [
    {
      id: 1,
      url: `/leagues/${data.league.id}/statistics`,
      text: 'Statistics',
    },
    {
      id: 2,
      url: `/leagues/${data.league.id}/statistics/pets`,
      text: 'Pets Statistics',
    },
    {
      id: 3,
      url: `/leagues/${data.league.id}/rankings`,
      text: 'Rankings',
    },
  ];

  return (
    <Container className='lg:px-5'>
      <Heading>{data.league.name}</Heading>
      <Paragraph className='flex justify-center gap-2.5 mb-5 lg:mb-10'>
        <span className='text-foreground/80 text-sm'>
          {`${new Date(data.league.start_date).toLocaleDateString()}`}
          <span className='mx-2.5 text-foreground/50'>{'~'}</span>
          {data.league.end_date === '1999-12-31T22:00:00' ||
          data.league.end_date === null
            ? 'Ongoing'
            : `${new Date(data.league.end_date).toLocaleDateString()}`}
        </span>
        <span className='mx-2.5 text-foreground/80'>{'•'}</span>
        <span className='text-humanoid text-sm'>
          {data.league.participant_count}
          {' participants'}
        </span>
      </Paragraph>
      <PageMenu links={links} />
      <div className='flex justify-center md:justify-end gap-2.5 my-2.5 lg:mb-5'>
        {/* TODO: download button for statistics as PDF - this is for later because more complex */}
        <DownloadLeagueUsedPetsButton
          id={data.league.id}
          name={data.league.name}
        />
      </div>
      {matches && matches.length > 0 ? (
        <MatchList
          matches={matches}
          id={data.league.id}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      ) : (
        <div className='bg-light-grey rounded-lg p-2.5 lg:p-5 mt-2.5'>
          <Paragraph className='p-2.5 lg:p-5 rounded-lg bg-background text-center shadow-md'>
            {'There are no matches for this league available yet.'}
          </Paragraph>
        </div>
      )}
    </Container>
  );
}
