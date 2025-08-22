import Link from 'next/link';
import { Match } from './MatchList';

export interface MatchListItemProps {
  tournamentId: string;
  match: Match;
}

export const MatchListItem = ({ tournamentId, match }: MatchListItemProps) => {
  return (
    <Link
      key={match.id}
      href={`/tournaments/${tournamentId}/matches/${match.id}`}
      className='p-2.5 rounded-lg shadow-md bg-background hover:bg-medium-grey transition-all duration-300'
      title={`${match.player1} vs ${match.player2}`}
      aria-label={`${match.player1} vs ${match.player2}`}
    >
      <span className='flex flex-wrap justify-between items-center'>
        <span>
          {match.player1}
          {' vs '}
          {match.player2}
        </span>
        <span className='flex text-humanoid'>
          <span className='text-sm'>
            {new Date(match.date).toLocaleDateString()}
          </span>
          <span className='w-[1px] h-5 bg-light-grey mx-2.5 lg:mx-5 rounded-full' />
          <span className='text-sm'>{match.region}</span>
        </span>
      </span>
    </Link>
  );
};
