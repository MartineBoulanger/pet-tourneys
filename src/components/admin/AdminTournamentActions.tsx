import Link from 'next/link';
import { FaEdit } from 'react-icons/fa';
import { GiBattleGear } from 'react-icons/gi';
import { DeleteTournament } from './DeleteTournament';
import { DeleteTournamentProps } from './types';

export const AdminTournamentActions = ({ id, name }: DeleteTournamentProps) => {
  return (
    <div className='flex flex-col-reverse md:flex-row items-center justify-center md:justify-evenly gap-4'>
      <Link
        className='btn-link'
        href={`/admin/tournaments/${id}/matches`}
        title='matches list page'
        aria-label='matches list page'
      >
        <GiBattleGear />
      </Link>
      <Link
        className='btn-link'
        href={`/admin/tournaments/${id}/edit`}
        title='edit match'
        aria-label='edit match'
      >
        <FaEdit />
      </Link>
      <DeleteTournament id={id} name={name} />
    </div>
  );
};
