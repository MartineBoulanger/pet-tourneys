'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaTrash } from 'react-icons/fa';
import { deleteMatch } from '@/supabase/actions/matches';
import { Heading, Button, Paragraph } from '@/components/ui';
import { DeleteMatchProps } from './types';

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
      <Button
        variant='link'
        className='hover:text-red'
        type='button'
        onClick={() => setIsOpen(true)}
        title={`Delete match ${player1} vs ${player2}`}
        aria-label={`Delete match ${player1} vs ${player2}`}
      >
        <FaTrash />
      </Button>
      {isOpen && (
        <div
          className='fixed inset-0 bg-background/80 flex items-center justify-center z-50'
          onClick={() => setIsOpen(false)}
        >
          <div
            className='bg-light-grey rounded-lg p-5 max-w-md w-full'
            onClick={(e) => e.stopPropagation()}
          >
            <Heading className='mb-5'>{'Confirm Deletion'}</Heading>
            <Paragraph className='mb-5'>
              {
                'Are you sure you want to delete the match with the battle logs '
              }
              <strong className='text-humanoid'>
                {player1 + ' vs ' + player2}
              </strong>
              {'? This action cannot be undone.'}
            </Paragraph>
            <div className='flex justify-end gap-5'>
              <Button
                onClick={() => setIsOpen(false)}
                variant='secondary'
                disabled={isDeleting}
                title='cancel delete match'
                aria-label='cancel delete match'
              >
                {'Cancel'}
              </Button>
              <Button
                onClick={handleDeleteMatch}
                disabled={isDeleting}
                title='delete match'
                aria-label='delete match'
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
