'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaTrash } from 'react-icons/fa';
import { deleteMatch } from '@/supabase/actions/matches';
import { DeleteMatchProps } from '@/types';

export const DeleteMatch = ({
  tournamentId,
  matchId,
  player1,
  player2,
}: DeleteMatchProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteMatch = async () => {
    setIsDeleting(true);
    try {
      await deleteMatch(tournamentId, matchId);
      router.refresh();
      // Close modal after successful deletion
      setIsOpen(false);
    } catch (error) {
      console.error('Error deleting tournament:', error);
      alert('Failed to delete tournament');
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <>
      <button
        className='btn-link hover:text-red'
        type='button'
        onClick={() => setIsOpen(true)}
        title={`Delete match ${player1} vs ${player2}`}
        aria-label={`Delete match ${player1} vs ${player2}`}
      >
        <FaTrash />
      </button>
      {/* Confirmation Modal */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-background/80 flex items-center justify-center p-4 z-50'
          onClick={() => setIsOpen(false)}
        >
          <div
            className='bg-light-grey rounded-lg p-5 max-w-md w-full'
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className='mb-4'>{'Confirm Deletion'}</h1>
            <p className='mb-6'>
              {
                'Are you sure you want to delete the match with the battle logs '
              }
              <strong className='text-light-blue'>
                {player1 + ' vs ' + player2}
              </strong>
              {'? This action cannot be undone.'}
            </p>

            <div className='flex justify-end gap-3'>
              <button
                onClick={() => setIsOpen(false)}
                className='btn-cancel px-4 py-2'
                disabled={isDeleting}
                title='cancel delete match'
                aria-label='cancel delete match'
              >
                {'Cancel'}
              </button>
              <button
                onClick={handleDeleteMatch}
                className='btn-submit px-4 py-2'
                disabled={isDeleting}
                title='delete match'
                aria-label='delete match'
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
