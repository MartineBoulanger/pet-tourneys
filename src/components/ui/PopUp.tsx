'use client';

import { useState } from 'react';
import { PiDotsThreeOutlineVertical } from 'react-icons/pi';
import { cn } from '@/utils/cn';
import { PopupProps } from '@/types';
import { Button } from '@/components/ui';

export const PopUp = ({
  text = '',
  children,
  className,
  divClassName,
}: PopupProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleActionMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={cn('relative', className)}>
      <Button type='button' onClick={toggleActionMenu}>
        {text ? text : <PiDotsThreeOutlineVertical className='w-6 h-6' />}
      </Button>
      {isOpen && (
        <div
          className={cn(
            'absolute top-full bg-dark-grey p-4 rounded-lg shadow-md animate-slide-in-top',
            divClassName
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};
