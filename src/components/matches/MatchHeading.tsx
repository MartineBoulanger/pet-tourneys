import { Match } from '@/types';
import Link from 'next/link';

interface MatchHeadingProps {
  match: Match;
  tournamentId: string;
}

export const MatchHeading = ({ match, tournamentId }: MatchHeadingProps) => {
  return (
    <div className='flex flex-col md:flex-row items-start md:items-center justify-center md:justify-between mb-10 md:mb-5'>
      <h1>
        {match.player1} vs {match.player2}{' '}
        <span className='text-xl text-gray-500'>{match.region}</span>
      </h1>
      {match && (
        <div className='flex gap-2.5'>
          <Link
            href={`/tournaments/${tournamentId}`}
            className='btn-submit py-2 px-4 rounded-lg uppercase'
          >
            {'Back to Tournament'}
          </Link>
          <Link
            href={`/tournaments/${tournamentId}/statistics?matchId=${match.id}`}
            className='btn-submit py-2 px-4 rounded-lg uppercase mb-10 lg:mb-0 w-fit'
          >
            {'View Match Pet Usage'}
          </Link>
        </div>
      )}
    </div>
  );
};
