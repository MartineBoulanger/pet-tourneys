'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaTrash } from 'react-icons/fa';
import { deleteTournament } from '@/features/supabase/actions/tournaments';
import { Heading, Button, Paragraph } from '@/components/ui';

export interface DeleteTournamentProps {
  id: string;
  name: string;
}

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
        title={`Delete league ${name}`}
        aria-label={`Delete league ${name}`}
      >
        <FaTrash />
      </Button>
      {isOpen && (
        <div
          className='fixed inset-0 bg-background/80 flex items-center justify-center z-[123]'
          onClick={() => setIsOpen(false)}
        >
          <div
            className='bg-light-grey rounded-lg p-2.5 lg:p-5 max-w-md w-full m-5 lg:m-0'
            onClick={(e) => e.stopPropagation()}
          >
            <Heading className='mb-2.5 lg:mb-5'>{'Confirm Deletion'}</Heading>
            <Paragraph className='mb-2.5 lg:mb-5'>
              {'Are you sure you want to delete the league '}
              <strong className='text-humanoid'>{name}</strong>
              {'? This action cannot be undone.'}
            </Paragraph>
            <div className='flex justify-end gap-2.5 lg:gap-5'>
              <Button
                onClick={() => setIsOpen(false)}
                variant='secondary'
                disabled={isDeleting}
                title='cancel delete league'
                aria-label='cancel delete league'
              >
                {'Cancel'}
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                title='delete league'
                aria-label='delete league'
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
