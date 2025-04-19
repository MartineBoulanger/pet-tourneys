import Link from 'next/link';
import { AdminMatchListItemProps } from '@/types';
import { AdminTournamentMatchActions } from './AdminTournamentMatchActions';

export const AdminMatchListItem = ({
  match,
  tournament,
}: AdminMatchListItemProps) => {
  return (
    <div className='p-4 rounded-lg shadow-md bg-light-grey flex justify-between items-center'>
      <div>
        <Link
          key={match.id}
          href={`/tournaments/${tournament.id}/matches/${match.id}`}
          className='link'
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
        <div className='flex mt-2'>
          <div className='text-sm text-gray-500'>
            {new Date(match.date).toLocaleDateString()}
          </div>
          <div className='mx-5 text-gray-500'>•</div>
          <div className='text-sm text-gray-500'>{match.region}</div>
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
