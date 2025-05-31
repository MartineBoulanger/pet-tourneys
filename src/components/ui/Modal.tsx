'use client';

import { IoMdClose } from 'react-icons/io';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui';

export function Modal({
  children,
  className,
  onClose,
  show,
}: {
  children: React.ReactNode;
  className?: string;
  onClose: () => void;
  show: boolean;
}) {
  return show ? (
    <div className='fixed inset-0 flex items-center justify-center z-[99999]'>
      <div
        className='absolute inset-0 bg-background/95 z-[99999]'
        onClick={onClose}
      />

      <div
        className={cn(
          'relative z-[99999] bg-light-grey rounded-lg shadow-md',
          'max-w-full max-h-[90vh] w-full sm:max-w-[512px] mx-5 sm:mx-0',
          'overflow-y-auto',
          className
        )}
      >
        <Button className='absolute right-2.5 top-2.5' onClick={onClose}>
          <IoMdClose className='w-6 h-6' />
        </Button>
        <div className='p-2.5 sm:p-5 z-[99999]'>{children}</div>
      </div>
    </div>
  ) : null;
}
