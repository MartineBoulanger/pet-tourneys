'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaTrash } from 'react-icons/fa';
import { deleteTournament } from '@/supabase/actions/tournaments';
import { Heading, Button, Paragraph } from '@/components/ui';
import { DeleteTournamentProps } from './types';

export const DeleteTournament = ({ id, name }: DeleteTournamentProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTournament(id);
      router.refresh();
      setIsOpen(false);
    } catch (err) {
      console.error(err);
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
        title={`Delete tournament ${name}`}
        aria-label={`Delete tournament ${name}`}
      >
        <FaTrash />
      </Button>
      {isOpen && (
        <div
          className='fixed inset-0 bg-background/80 flex items-center justify-center z-[123]'
          onClick={() => setIsOpen(false)}
        >
          <div
            className='bg-light-grey rounded-lg p-2.5 sm:p-5 max-w-md w-full m-5 sm:m-0'
            onClick={(e) => e.stopPropagation()}
          >
            <Heading className='mb-2.5 sm:mb-5'>{'Confirm Deletion'}</Heading>
            <Paragraph className='mb-2.5 sm:mb-5'>
              {'Are you sure you want to delete the tournament '}
              <strong className='text-humanoid'>{name}</strong>
              {'? This action cannot be undone.'}
            </Paragraph>
            <div className='flex justify-end gap-2.5 sm:gap-5'>
              <Button
                onClick={() => setIsOpen(false)}
                variant='secondary'
                disabled={isDeleting}
                title='cancel delete tournament'
                aria-label='cancel delete tournament'
              >
                {'Cancel'}
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                title='delete tournament'
                aria-label='delete tournament'
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
