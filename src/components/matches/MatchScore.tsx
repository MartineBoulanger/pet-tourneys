import { MatchScoreProps } from '@/types';
import { Paragraph } from '@/components/ui';

export const MatchScore = ({ match }: MatchScoreProps) => {
  return (
    <>
      <div className='mb-8 p-4 bg-light-grey rounded-lg shadow-md'>
        <div className='flex justify-between items-center'>
          <div className='text-center'>
            <Paragraph className='text-lg font-medium'>
              {match.player1}
            </Paragraph>
            <Paragraph className='text-3xl font-bold'>
              {match.owner === match.player1
                ? match.owner_score
                : match.opponent_score}
            </Paragraph>
          </div>
          <div className='text-xl font-bold text-light-blue'>{'vs'}</div>
          <div className='text-center'>
            <Paragraph className='text-lg font-medium'>
              {match.player2}
            </Paragraph>
            <Paragraph className='text-3xl font-bold'>
              {match.owner === match.player2
                ? match.owner_score
                : match.opponent_score}
            </Paragraph>
          </div>
        </div>
      </div>

      <div className='mb-5 md:mb-10 text-foreground'>
        <Paragraph>
          <span>{'Played on '}</span>
          <span className='font-bold text-light-blue'>
            {new Date(match.date).toLocaleString()}
          </span>
        </Paragraph>
        <Paragraph>
          <span>{'Logs submitted by '}</span>
          <span className='font-bold text-light-blue'>{match.owner}</span>
        </Paragraph>
      </div>
    </>
  );
};
