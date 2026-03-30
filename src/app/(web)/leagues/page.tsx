import { notFound } from 'next/navigation';
import { getLeagues } from '@/actions/supabase/api-schema/leagues/getLeagues';
import { LeaguesList } from '@/components/leagues/LeaguesList';
import { Container, Heading, Paragraph } from '@/components/ui';
import { PageSearchParams } from '@/types/global.types';

export async function generateMetadata() {
  return {
    title: 'Leagues',
    description: "Pet Masters League's tournaments list page",
    alternates: {
      canonical: `${process.env.BASE_URL!}/tournaments`,
    },
  };
}

const TOURNAMENTS_PER_PAGE = 18;

export default async function TournamentsPage({
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
    return (
      <Container className='text-center'>
        <Heading className='text-red'>{'Error!'}</Heading>
        <Paragraph>{error}</Paragraph>
      </Container>
    );
  }

  if (!data) return notFound();

  return (
    <Container>
      <Heading>{'PML Leagues'}</Heading>
      {data.length > 0 ? (
        <LeaguesList
          leagues={data}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      ) : (
        <Paragraph className='p-2.5 lg:p-5 rounded-lg bg-background text-center shadow-md'>
          {'There are no leagues available yet.'}
        </Paragraph>
      )}
    </Container>
  );
}
