import Link from 'next/link';
import { FaEdit, FaClipboard } from 'react-icons/fa';
import { GiBattleGear } from 'react-icons/gi';
import { DeleteTournament, DeleteTournamentProps } from './DeleteTournament';

export const AdminTournamentActions = ({ id, name }: DeleteTournamentProps) => {
  return (
    <div className='flex flex-col lg:flex-row items-center justify-center lg:justify-evenly gap-2.5 lg:gap-5'>
      <Link
        className='btn-link'
        href={`/admin/tournaments/${id}/matches`}
        title='Matches List Page'
        aria-label='Matches List Page'
      >
        <GiBattleGear />
      </Link>
      <Link
        className='btn-link'
        href={`/admin/tournaments/${id}/players`}
        title='Players List Page'
        aria-label='Players List Page'
      >
        <FaClipboard />
      </Link>
      <Link
        className='btn-link'
        href={`/admin/tournaments/${id}/edit`}
        title='Edit Match'
        aria-label='Edit Match'
      >
        <FaEdit />
      </Link>
      <DeleteTournament id={id} name={name} />
    </div>
  );
};
