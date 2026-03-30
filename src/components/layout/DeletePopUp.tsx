'use client';

import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { Button, Heading } from '@/components/ui';
import { Modal } from '@/components/layout';
import { DeletePopupProps } from '@/types/components.types';
import { cn } from '@/utils/cn';

export const DeletePopup = ({
  text = '',
  btnText = '',
  children,
  className,
  isDeleting = false,
  onDelete,
  variant = 'link',
}: DeletePopupProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant={variant}
        className={cn('hover:text-red', className)}
        type='button'
        onClick={() => setIsOpen(true)}
        title={text ? text : 'delete this item'}
        aria-label={text ? text : 'delete this item'}
      >
        {btnText ? btnText : <FaTrash />}
      </Button>
      {isOpen && (
        <Modal show={isOpen} onClose={() => setIsOpen(false)}>
          <Heading as='h2' className='mb-2.5'>
            {'Confirm Deletion'}
          </Heading>
          {children}
          <div className='flex justify-end gap-2.5'>
            <Button
              onClick={() => setIsOpen(false)}
              variant='secondary'
              disabled={isDeleting}
              title='cancel delete'
              aria-label='cancel delete'
            >
              {'Cancel'}
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              title='delete'
              aria-label='delete'
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};
