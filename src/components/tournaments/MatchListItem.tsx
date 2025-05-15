import Link from 'next/link';
import { MatchListItemProps } from './types';

export const MatchListItem = ({ tournamentId, match }: MatchListItemProps) => {
  return (
    <Link
      key={match.id}
      href={`/tournaments/${tournamentId}/matches/${match.id}`}
      className='p-4 rounded-lg shadow-md bg-light-grey hover:bg-blue-grey'
      title={`${match.player1} vs ${match.player2}`}
      aria-label={`${match.player1} vs ${match.player2}`}
    >
      <span className='flex flex-wrap justify-between items-center'>
        <span>
          {match.player1}
          {' vs '}
          {match.player2}
        </span>
        <span className='flex text-light-blue'>
          <span className='text-sm'>
            {new Date(match.date).toLocaleDateString()}
          </span>
          <span className='w-[1px] h-5 bg-gray-500 mx-5 rounded-full' />
          <span className='text-sm'>{match.region}</span>
        </span>
      </span>
    </Link>
  );
};
