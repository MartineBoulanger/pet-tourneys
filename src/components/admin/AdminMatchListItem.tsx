import Link from 'next/link';
import { AdminTournamentMatchActions } from './AdminTournamentMatchActions';
import { AdminMatchListItemProps } from './types';

export const AdminMatchListItem = ({
  match,
  tournament,
}: AdminMatchListItemProps) => {
  return (
    <div className='p-2.5 lg:p-5 rounded-lg shadow-md bg-background flex justify-between items-center'>
      <div>
        <Link
          key={match.id}
          href={`/tournaments/${tournament.id}/matches/${match.id}`}
          className='link text-foreground'
          title={`${match.player1} vs ${match.player2}`}
          aria-label={`${match.player1} vs ${match.player2}`}
        >
          {match.player1} vs {match.player2} (
          {match.owner === match.player1
            ? match.owner_score
            : match.opponent_score}{' '}
          -{' '}
          {match.owner === match.player2
            ? match.owner_score
            : match.opponent_score}
          )
        </Link>
        <div className='flex mt-2.5 text-humanoid'>
          <div className='text-sm lg:text-base'>
            {new Date(match.date).toLocaleDateString()}
          </div>
          <div className='mx-5 text-light-grey'>•</div>
          <div className='text-sm lg:text-base'>{match.region}</div>
        </div>
      </div>
      <AdminTournamentMatchActions
        tournamentId={tournament.id}
        matchId={match.id}
        player1={match.player1}
        player2={match.player2}
      />
    </div>
  );
};
