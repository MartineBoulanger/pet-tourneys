'use client';

import { useState } from 'react';
import { PiDotsThreeOutlineVertical } from 'react-icons/pi';
import { cn } from '@/utils/cn';
import { PopupProps } from '@/types';

export const PopUp = ({ children, className }: PopupProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleActionMenu = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <div className={cn('relative', className)}>
      <button type='button' onClick={toggleActionMenu}>
        <PiDotsThreeOutlineVertical className='w-6 h-6' />
      </button>
      {isOpen && (
        <div className='absolute top-full right-0 bg-dark-grey p-4 rounded-lg shadow-md w-[150px]'>
          {children}
        </div>
      )}
    </div>
  );
};
