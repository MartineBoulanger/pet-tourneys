import { notFound } from 'next/navigation';
import { getTournaments } from '@/supabase/actions/tournaments';
import {
  Container,
  Heading,
  PageHeading,
  PageMenu,
  Paragraph,
} from '@/components/ui';
import { TournamentsList } from '@/components/tournaments';
import { PageSearchParams } from '@/types';
import { TOURNAMENTS_PER_PAGE } from '@/utils/constants';
import { Links } from '@/lib/types';

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
    {
      id: 3,
      url: `/tournaments/stages`,
      text: 'Stages',
    },
    {
      id: 4,
      url: '/tournaments/schedule',
      text: 'Schedule',
    },
    {
      id: 5,
      url: '/tournaments/sign-ups',
      text: 'Sign-ups',
    },
  ];

  return (
    <Container className='lg:px-5'>
      <PageHeading heading='Tournaments'>
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
          {'There are no tournaments available yet.'}
        </Paragraph>
      )}
    </Container>
  );
}
