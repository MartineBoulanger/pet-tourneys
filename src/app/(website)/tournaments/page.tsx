import { notFound } from 'next/navigation';
import { getTournaments } from '@/features/supabase/actions/tournaments';
import { TournamentsList } from '@/features/supabase/components/tournaments/TournamentsList';
import { TOURNAMENTS_PER_PAGE } from '@/utils/constants';
import {
  Container,
  Heading,
  PageHeading,
  PageMenu,
  Paragraph,
} from '@/components/ui';
import { PageSearchParams } from '@/types';
import { Links } from '@/lib/types';

export async function generateMetadata() {
  return {
    title: 'Leagues',
    alternates: {
      canonical: `${process.env.BASE_URL!}/tournaments`,
    },
  };
}

export default async function TournamentsPage({
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
      <Container className='text-center'>
        <Heading className='text-red'>{`Error ${status}!`}</Heading>
        <Paragraph>{message}</Paragraph>
      </Container>
    );
  }

  if (!tournaments) return notFound();

  const links: Links = [
    {
      id: 1,
      url: `/tournaments/rules`,
      text: 'Rules',
    },
    {
      id: 2,
      url: `/tournaments/prizes`,
      text: 'Prizes',
    },
  ];

  return (
    <Container className='lg:px-5'>
      <PageHeading heading='Leagues'>
        <PageMenu links={links} />
      </PageHeading>
      {tournaments.length > 0 ? (
        <TournamentsList
          tournaments={tournaments}
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
