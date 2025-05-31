import Link from 'next/link';
import { FaEdit } from 'react-icons/fa';
import { DeleteMatch } from './DeleteMatch';
import { DeleteMatchProps } from './types';

export const AdminTournamentMatchActions = ({
  tournamentId,
  matchId,
  player1,
  player2,
}: DeleteMatchProps) => {
  return (
    <div className='flex flex-col-reverse md:flex-row items-center justify-center md:justify-evenly gap-2.5 sm:gap-5'>
      <Link
        className='btn-link'
        href={`/admin/tournaments/${tournamentId}/matches/${matchId}/edit`}
        title='edit tournament'
        aria-label='edit tournament'
      >
        <FaEdit />
      </Link>
      <DeleteMatch
        tournamentId={tournamentId}
        matchId={matchId}
        player1={player1}
        player2={player2}
      />
    </div>
  );
};
