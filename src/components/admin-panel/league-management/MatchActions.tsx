'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEdit } from 'react-icons/fa';
import { DeleteMatchProps } from '@/types/components.types';
import { DeletePopup } from '@/components/layout';
import { Paragraph } from '@/components/ui';
import { deleteMatch } from '@/actions/supabase/api-schema/matches/deleteMatch';

export const MatchActions = ({
  leagueId,
  matchId,
  player1,
  player2,
}: DeleteMatchProps) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteMatch = async () => {
    setIsDeleting(true);
    try {
      await deleteMatch(leagueId, matchId);
      router.refresh();
    } catch (error) {
      console.error('Error deleting match:', error);
      alert('Failed to delete match');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className='flex flex-col lg:flex-row items-center justify-center lg:justify-evenly gap-2.5 lg:gap-5'>
      <Link
        className='btn-link'
        href={`/admin-panel/leagues/${leagueId}/matches/${matchId}/edit`}
        title='edit league match'
        aria-label='edit league match'
      >
        <FaEdit />
      </Link>
      <DeletePopup
        text={`Delete match ${player1} vs ${player2}`}
        isDeleting={isDeleting}
        onDelete={handleDeleteMatch}
      >
        <Paragraph className='mb-2.5'>
          {'Are you sure you want to delete the match from '}
          <strong className='text-humanoid'>
            {player1 + ' vs ' + player2}
          </strong>
          {'? This action cannot be undone.'}
        </Paragraph>
      </DeletePopup>
    </div>
  );
};
