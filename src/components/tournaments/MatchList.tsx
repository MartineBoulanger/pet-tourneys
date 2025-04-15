import Link from 'next/link';
import { MatchListItem } from './MatchListItem';
import { Match } from '@/types';

interface MatchListProps {
  matches: Match[];
  tournamentId: string;
}

export const MatchList = ({ matches, tournamentId }: MatchListProps) => {
  return (
    <>
      <h2 className='text-xl mb-5'>{'Recent Matches'}</h2>
      <div className='grid gap-4'>
        {matches?.slice(0, 10).map((match) => (
          <MatchListItem
            key={match.id}
            tournamentId={tournamentId}
            match={match}
          />
        ))}
        {matches.length > 5 && (
          <Link href={`/tournaments/${tournamentId}/matches`} className='link'>
            {'View all matches '}({matches.length})
          </Link>
        )}
      </div>
    </>
  );
};
