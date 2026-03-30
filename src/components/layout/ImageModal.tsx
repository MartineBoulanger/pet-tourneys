'use client';

import Image from 'next/image';
import { Button } from '@/components/ui';
import { ImageModalProps } from '@/types/components.types';
import { FaTimes } from 'react-icons/fa';
import { DownloadImageButton } from './DownloadImageButton';

export function ImageModal({
  image,
  setIsOpen,
  isDownloadable,
}: ImageModalProps) {
  return (
    <div className='fixed inset-0 z-70 flex items-center justify-center p2.5 lg:p-5 bg-black/85'>
      <div className='bg-light-grey rounded-lg shadow-md max-w-5xl max-h-[90vh] w-full mx-5 lg:mx-0 relative'>
        <Button
          variant='secondary'
          onClick={() => setIsOpen(false)}
          className='p-2 rounded-full absolute top-2.5 lg:top-5 right-2.5 lg:right-5'
        >
          <FaTimes className='w-5 h-5' />
        </Button>
        <div className='flex-1 flex items-center justify-center py-2.5 lg:py-5'>
          <Image
            src={image.secure_url}
            alt={image.public_id}
            style={{
              maxHeight: 'calc(90vh - 350px)',
              width: 'auto',
              height: 'auto',
            }}
            className='w-full h-full object-cover'
            width={image.width}
            height={image.height}
          />
        </div>
        {isDownloadable && (
          <div className='absolute top-2.5 lg:top-5 left-2.5 lg:left-5'>
            <DownloadImageButton
              publicId={image.public_id}
              className='backdrop-blur-sm shadow-lg'
            />
          </div>
        )}
      </div>
    </div>
  );
}
