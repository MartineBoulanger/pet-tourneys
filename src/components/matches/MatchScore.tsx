import { MatchScoreProps } from '@/types';

export const MatchScore = ({ match }: MatchScoreProps) => {
  return (
    <>
      <div className='mb-8 p-4 bg-light-grey rounded-lg shadow-md'>
        <div className='flex justify-between items-center'>
          {/* Player 1 Score */}
          <div className='text-center'>
            <p className='text-lg font-medium'>{match.player1}</p>
            <p className='text-3xl font-bold'>
              {match.owner === match.player1
                ? match.owner_score
                : match.opponent_score}
            </p>
          </div>

          <div className='text-xl font-bold text-blue'>{'vs'}</div>

          {/* Player 2 Score */}
          <div className='text-center'>
            <p className='text-lg font-medium'>{match.player2}</p>
            <p className='text-3xl font-bold'>
              {match.owner === match.player2
                ? match.owner_score
                : match.opponent_score}
            </p>
          </div>
        </div>
      </div>

      <div className='mb-5 md:mb-10 text-gray-500'>
        <p>
          {'Played on '}
          <span className='font-bold text-foreground'>
            {new Date(match.date).toLocaleString()}
          </span>
        </p>
        <p>
          {'Logs submitted by '}
          <span className='font-bold text-foreground'>{match.owner}</span>
        </p>
      </div>
    </>
  );
};
