import { MatchListItem } from './MatchListItem';
import { MatchListProps } from './types';
import { Pagination, Heading } from '@/components/ui';

export const MatchList = ({
  matches,
  tournamentId,
  currentPage = 1,
  totalPages = 1,
}: MatchListProps) => {
  return (
    <>
      <Heading as='h2' className='text-xl mb-2.5'>
        {'Tournament Matches'}
      </Heading>
      <div className='grid gap-2.5 sm:gap-5 mb-2.5 sm:mb-5 bg-light-grey p-2.5 sm:p-5 rounded-lg'>
        {matches.map((match) => (
          <MatchListItem
            key={match.id}
            tournamentId={tournamentId}
            match={match}
          />
        ))}
        {totalPages > 1 ? (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl={`/tournaments/${tournamentId}`}
          />
        ) : null}
      </div>
    </>
  );
};
