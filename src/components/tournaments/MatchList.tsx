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
      <Heading as='h2' className='text-xl mb-5'>
        {'Tournament Matches'}
      </Heading>
      <div className='grid gap-4 mb-6'>
        {matches.map((match) => (
          <MatchListItem
            key={match.id}
            tournamentId={tournamentId}
            match={match}
          />
        ))}
      </div>
      {totalPages > 1 ? (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl={`/tournaments/${tournamentId}`}
        />
      ) : null}
    </>
  );
};
