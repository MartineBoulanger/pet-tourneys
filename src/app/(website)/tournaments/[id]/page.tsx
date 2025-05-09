import Link from 'next/link';
import { Fragment } from 'react';
import { notFound } from 'next/navigation';
import { getTournamentDetails } from '@/supabase/actions/tournaments';
import { getPaginatedMatches } from '@/supabase/actions/matches';
import { MatchList } from '@/components/tournaments';
import {
  Container,
  PageHeading,
  Heading,
  Paragraph,
  ActionDropdownItem,
} from '@/components/ui';
import { PageParams, PageSearchParams } from '@/types';
import { MATCHES_PER_PAGE } from '@/types/constants';
import { linksData } from '@/lib/linksData';

export async function generateMetadata({ params }: { params: PageParams }) {
  const { id } = await params;
  return {
    title: 'Tourney Details',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL!}/tournaments/${id}`,
    },
  };
}

export default async function TournamentPage({
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
      <Container className='text-center'>
        <Heading className='text-red'>{`Error ${status || stat}!`}</Heading>
        <Paragraph>{message}</Paragraph>
      </Container>
    );
  }

  if (!tournament || !matches) return notFound();

  return (
    <Container>
      <PageHeading heading={tournament.name}>
        <div className='flex flex-col gap-2.5'>
          {linksData.tournament.map((link) => {
            const url = link.full_url
              ? link.full_url
              : `${link.url_prefix}${tournament.id}${
                  link.url_suffix ? link.url_suffix : ''
                }`;
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
      <div className='mb-10 text-foreground'>
        <Paragraph>
          {new Date(tournament.start_date).toLocaleDateString()} -{' '}
          {tournament.end_date === '1999-12-31T22:00:00' ||
          tournament.end_date === null
            ? 'Ongoing'
            : new Date(tournament.end_date).toLocaleDateString()}
        </Paragraph>
        <Paragraph className='font-bold text-light-blue'>
          {tournament.participant_count}
          {' participants'}
        </Paragraph>
      </div>
      {matches && matches.length > 0 ? (
        <MatchList
          matches={matches}
          tournamentId={tournament.id}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      ) : (
        <Paragraph className='p-4 rounded-lg bg-light-grey text-center shadow-md'>
          {'There are no matches for this tournament available yet.'}
        </Paragraph>
      )}
    </Container>
  );
}
