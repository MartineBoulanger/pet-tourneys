import Link from 'next/link';
import { FaEdit } from 'react-icons/fa';
import { GiBattleGear } from 'react-icons/gi';
import { DeleteTournament } from './DeleteTournament';

export const AdminTournamentActions = ({
  id,
  name,
}: {
  id: string;
  name: string;
}) => {
  return (
    <div className='flex items-center justify-evenly gap-2 md:gap-4'>
      <Link className='btn-link' href={`/admin/tournaments/${id}/matches`}>
        <GiBattleGear />
      </Link>
      <Link className='btn-link' href={`/admin/tournaments/${id}/edit`}>
        <FaEdit />
      </Link>
      <DeleteTournament id={id} name={name} />
    </div>
  );
};
