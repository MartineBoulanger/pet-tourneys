import Link from 'next/link';
import { MatchListItem } from './MatchListItem';
import { MatchListProps } from '@/types';
import { Pagination } from '@/components/ui';

export const MatchList = ({
  matches,
  tournamentId,
  currentPage = 1,
  totalPages = 1,
  showPagination = false,
}: MatchListProps) => {
  return (
    <>
      <h2 className='text-xl mb-5'>{'Tournament Matches'}</h2>
      <div className='grid gap-4 mb-6'>
        {matches.map((match) => (
          <MatchListItem
            key={match.id}
            tournamentId={tournamentId}
            match={match}
          />
        ))}
      </div>
      {showPagination && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl={`/tournaments/${tournamentId}`}
        />
      )}
      {!showPagination && matches.length > 10 && (
        <Link href={`/tournaments/${tournamentId}/matches`} className='link'>
          {'View all matches '}({matches.length})
        </Link>
      )}
    </>
  );
};
