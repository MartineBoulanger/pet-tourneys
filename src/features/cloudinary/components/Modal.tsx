'use client';

import Image from 'next/image';
import { FaTimes, FaTrashAlt } from 'react-icons/fa';
import { Button, Paragraph } from '@/components/ui';
import { ImageModalProps } from '../types';

export function ImageModal({ image, onClose, onDelete }: ImageModalProps) {
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this image?')) {
      onDelete(image.public_id);
      onClose();
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85'>
      <div className='relative max-w-5xl max-h-[90vh] w-full'>
        {/* Close Button */}
        <Button
          variant='secondary'
          onClick={onClose}
          className='absolute top-4 right-4 z-10 p-2.5 rounded-full'
        >
          <FaTimes className='w-5 h-5' />
        </Button>

        {/* Image Container */}
        <div className='bg-light-grey rounded-lg overflow-auto shadow-md max-h-[90vh] flex flex-col'>
          {/* Image */}
          <div className='flex-1 flex items-center justify-center p-2.5 lg:p-5'>
            <Image
              src={image.secure_url}
              alt={image.public_id}
              width={image.width}
              height={image.height}
              className='max-w-full max-h-full object-contain rounded-lg overflow-hidden'
              style={{
                maxHeight: 'calc(90vh - 350px)',
                width: 'auto',
                height: 'auto',
              }}
              unoptimized
            />
          </div>

          {/* Image Info */}
          <div className='px-2.5 lg:px-5 bg-light-grey'>
            <div className='grid grid-cols-1 gap-2.5 py-5 border-t border-foreground/30'>
              <div className='space-y-1 text-sm'>
                <Paragraph className='text-sm'>
                  <strong className='text-foreground/50'>{'Size: '}</strong>
                  {(image.bytes / 1024).toFixed(1)}
                  {' KB'}
                </Paragraph>
                <Paragraph className='text-sm'>
                  <strong className='text-foreground/50'>
                    {'Dimensions:'}
                  </strong>{' '}
                  {image.width}
                  {' × '}
                  {image.height}
                  {' pixels'}
                </Paragraph>
                <Paragraph>
                  <strong className='text-foreground/50'>{'Image ID:'}</strong>{' '}
                  {image.public_id}
                </Paragraph>
                <Paragraph>
                  <strong className='text-foreground/50'>{'Image URL:'}</strong>{' '}
                  {image.secure_url}
                </Paragraph>
                <Paragraph className='text-sm'>
                  <strong className='text-foreground/50'>{'Uploaded: '}</strong>
                  {new Date(image.created_at).toLocaleDateString()}
                </Paragraph>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex justify-end items-center gap-2.5 lg:gap-5 py-5 border-t border-foreground/30'>
              <Button
                variant='secondary'
                onClick={handleDelete}
                className='flex items-center gap-2'
              >
                <FaTrashAlt className='w-5 h-5' />
                <span>{'Delete'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
