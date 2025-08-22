import { MatchListItem } from './MatchListItem';
import { Pagination, Heading } from '@/components/ui';

export interface Match {
  id: string;
  region: string;
  player1: string;
  player2: string;
  owner: string;
  date: string;
  owner_score: number;
  opponent_score: number;
  outcome: string;
}

export interface MatchListProps {
  matches: Match[];
  tournamentId: string;
  currentPage?: number;
  totalPages?: number;
}

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
      <div className='grid gap-2.5 bg-light-grey p-2.5 rounded-lg'>
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
            className='my-2.5'
          />
        ) : null}
      </div>
    </>
  );
};
