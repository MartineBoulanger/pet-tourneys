import { Paragraph } from '@/components/ui';
import { Match } from '@/types/supabase.types';

export const MatchScore = ({ match }: { match: Match }) => {
  return (
    <div className='mt-2.5'>
      <div className='mb-5 p-2.5 lg:p-5 bg-background rounded-lg shadow-md'>
        <div className='flex justify-between items-center'>
          <div className='text-center'>
            <Paragraph className='text-lg font-medium'>
              {match.player1}
            </Paragraph>
            <Paragraph className='text-3xl font-bold text-humanoid'>
              {match.owner === match.player1
                ? match.owner_score
                : match.opponent_score}
            </Paragraph>
          </div>
          <div className='text-xl font-bold'>{'vs'}</div>
          <div className='text-center'>
            <Paragraph className='text-lg font-medium'>
              {match.player2}
            </Paragraph>
            <Paragraph className='text-3xl font-bold text-humanoid'>
              {match.owner === match.player2
                ? match.owner_score
                : match.opponent_score}
            </Paragraph>
          </div>
        </div>
      </div>
      <div className='mb-5 lg:mb-10'>
        <Paragraph>
          <span>{'Played on '}</span>
          <span className='font-bold text-humanoid'>
            {new Date(match.date).toLocaleString()}
          </span>
        </Paragraph>
        <Paragraph>
          <span>{'Logs submitted by '}</span>
          <span className='font-bold text-humanoid'>{match.owner}</span>
        </Paragraph>
      </div>
    </div>
  );
};
