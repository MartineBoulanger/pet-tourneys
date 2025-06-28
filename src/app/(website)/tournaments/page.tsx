import { notFound } from 'next/navigation';
import { getTournaments } from '@/supabase/actions/tournaments';
import { Container, Heading, Paragraph } from '@/components/ui';
import { TournamentsList } from '@/components/tournaments';
import { PageSearchParams } from '@/types';
import { TOURNAMENTS_PER_PAGE } from '@/utils/constants';

export async function generateMetadata() {
  return {
    title: 'Tournaments',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL!}/tournaments`,
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

  return (
    <Container className='lg:px-5'>
      <Heading>{'Tournaments'}</Heading>
      {tournaments.length > 0 ? (
        <TournamentsList
          tournaments={tournaments}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      ) : (
        <Paragraph className='p-2.5 lg:p-5 rounded-lg bg-background text-center shadow-md'>
          {'There are no tournaments available yet.'}
        </Paragraph>
      )}
    </Container>
  );
}
