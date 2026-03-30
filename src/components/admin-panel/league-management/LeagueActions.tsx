'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaEdit, FaClipboard } from 'react-icons/fa';
import { GiBattleGear } from 'react-icons/gi';
import { DeleteLeagueProps } from '@/types/components.types';
import { deleteLeague } from '@/actions/supabase/api-schema/leagues/deleteLeague';
import { DeletePopup } from '@/components/layout';
import { Paragraph } from '@/components/ui';

export const LeagueActions = ({ id, name }: DeleteLeagueProps) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteLeague(id);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className='flex flex-col lg:flex-row items-center justify-center lg:justify-evenly gap-2.5 lg:gap-5'>
      <Link
        className='btn-link'
        href={`/admin-panel/leagues/${id}/matches`}
        title='Matches List Page'
        aria-label='Matches List Page'
      >
        <GiBattleGear />
      </Link>
      <Link
        className='btn-link'
        href={`/admin-panel/leagues/${id}/players`}
        title='Players List Page'
        aria-label='Players List Page'
      >
        <FaClipboard />
      </Link>
      <Link
        className='btn-link'
        href={`/admin-panel/leagues/${id}/edit`}
        title='Edit league'
        aria-label='Edit league'
      >
        <FaEdit />
      </Link>
      <DeletePopup
        text={`Delete league ${name}`}
        isDeleting={isDeleting}
        onDelete={handleDelete}
      >
        <Paragraph className='mb-2.5'>
          {'Are you sure you want to delete the league '}
          <strong className='text-humanoid'>{name}</strong>
          {'? This action cannot be undone.'}
        </Paragraph>
      </DeletePopup>
    </div>
  );
};
