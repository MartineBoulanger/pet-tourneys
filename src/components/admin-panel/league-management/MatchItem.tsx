import Link from 'next/link';
import { MatchItemProps } from '@/types/components.types';
import { MatchActions } from './MatchActions';
import { Paragraph } from '@/components/ui';

export const MatchItem = ({ match, league }: MatchItemProps) => {
  return (
    <div className='p-2.5 lg:px-5 rounded-lg shadow-md bg-background'>
      <div className='flex justify-between items-center'>
        <div className='flex flex-col'>
          <Link
            key={match.id}
            href={`/leagues/${league?.id}/match/${match.id}`}
            className='link font-bold text-humanoid'
            title={`${match.player1} vs ${match.player2}`}
            aria-label={`${match.player1} vs ${match.player2}`}
          >
            {match.player1}
            {' vs '}
            {match.player2}
          </Link>
          <Paragraph className='text-sm text-foreground/50'>
            {`score:
            ${
              match.owner === match.player1
                ? match.owner_score
                : match.opponent_score
            }
            -
            ${
              match.owner === match.player2
                ? match.owner_score
                : match.opponent_score
            }`}
          </Paragraph>
          <Paragraph className='text-sm text-foreground/80'>
            {new Date(match.date).toLocaleString()}
            <span className='mx-2.5 text-foreground/50'>{'•'}</span>
            {match.region}
          </Paragraph>
        </div>
        <MatchActions
          leagueId={league?.id || ''}
          matchId={match.id}
          player1={match.player1}
          player2={match.player2}
        />
      </div>
    </div>
  );
};
