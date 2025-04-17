'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaTrash } from 'react-icons/fa';
import { deleteTournament } from '@/supabase/actions/tournaments';

export const DeleteTournament = ({
  id,
  name,
}: {
  id: string;
  name: string;
}) => {
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
      <button
        className='btn-link hover:text-red'
        type='button'
        onClick={() => setIsOpen(true)}
        aria-label={`Delete tournament ${name}`}
      >
        <FaTrash />
      </button>
      {/* Confirmation Modal */}
      {isOpen && (
        <div className='fixed inset-0 bg-background/80 flex items-center justify-center p-4 z-50'>
          <div className='bg-light-grey rounded-lg p-5 max-w-md w-full'>
            <h2 className='mb-4'>{'Confirm Deletion'}</h2>
            <p className='mb-6'>
              {'Are you sure you want to delete the tournament '}
              <strong className='text-light-blue'>{name}</strong>
              {'? This action cannot be undone.'}
            </p>

            <div className='flex justify-end gap-3'>
              <button
                onClick={() => setIsOpen(false)}
                className='btn-cancel px-4 py-2'
                disabled={isDeleting}
              >
                {'Cancel'}
              </button>
              <button
                onClick={handleDelete}
                className='btn-submit px-4 py-2'
                disabled={isDeleting}
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
