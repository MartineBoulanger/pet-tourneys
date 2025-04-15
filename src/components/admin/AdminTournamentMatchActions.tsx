import Link from 'next/link';
import { FaEdit } from 'react-icons/fa';
import { DeleteMatch } from './DeleteMatch';

export const AdminTournamentMatchActions = ({
  id,
  matchId,
  player1,
  player2,
}: {
  id: string;
  matchId: string;
  player1: string;
  player2: string;
}) => {
  return (
    <div className='flex items-center justify-evenly gap-2 md:gap-4'>
      <Link
        className='btn-link'
        href={`/admin/tournaments/${id}/matches/${matchId}/edit`}
      >
        <FaEdit />
      </Link>
      <DeleteMatch
        tournamentId={id}
        matchId={matchId}
        player1={player1}
        player2={player2}
      />
    </div>
  );
};
