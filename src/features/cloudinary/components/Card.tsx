'use client';

import Image from 'next/image';
import { FaEye, FaTrashAlt } from 'react-icons/fa';
import { Button, Checkbox, Paragraph } from '@/components/ui';
import { cn } from '@/utils/cn';
import { ImageCardProps } from '../types';

export function ImageCard({
  image,
  selected,
  toggleSelection,
  onView,
  viewMode,
  onDelete,
}: ImageCardProps) {
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this image?')) {
      onDelete(image.public_id);
    }
  };

  return (
    <div
      className={cn(
        'relative bg-light-grey border border-foreground/30 rounded-lg overflow-hidden transition-all',
        selected ? 'ring-2 ring-humanoid' : 'hover:scale-101',
        viewMode === 'list' ? 'flex items-center justify-between p-2.5' : ''
      )}
    >
      {/* Checkbox */}
      <div className='absolute top-2.5 left-2.5 z-10'>
        <Checkbox
          id={image.public_id}
          name={image.public_id}
          checked={selected}
          onChange={() => toggleSelection(image.public_id)}
          className='w-5 h-5 text-humanoid rounded-lg'
        />
      </div>

      {/* Image */}
      <div
        className={cn(
          viewMode === 'grid'
            ? 'aspect-square relative'
            : 'w-15 h-15 flex-shrink-0 rounded overflow-hidden'
        )}
      >
        <Image
          src={image.secure_url}
          alt={image.public_id}
          className='w-full h-full object-cover'
          width={viewMode === 'grid' ? image.width : 80}
          height={viewMode === 'grid' ? image.height : 80}
          unoptimized
        />
      </div>

      {/* Info + Actions */}
      <div className='p-2.5'>
        <Paragraph className='text-sm text-foreground/50'>
          {'Size: '}
          {(image.bytes / 1024).toFixed(1)}
          {' KB'}
        </Paragraph>
        <Paragraph className='text-sm text-foreground/30'>
          {'Uploaded: '}
          {new Date(image.created_at).toLocaleDateString()}
        </Paragraph>
        <div className='flex gap-2.5 mt-2.5'>
          <Button
            onClick={onView}
            className={cn(
              'flex-1 px-3 py-2 bg-foreground hover:bg-foreground/80 text-background rounded transition-colors',
              viewMode === 'grid'
                ? 'flex flex-col items-center text-sm'
                : 'flex justify-center gap-2'
            )}
          >
            <FaEye className='w-5 h-5' />
            <span>{'View'}</span>
          </Button>
          <Button
            variant='secondary'
            onClick={handleDelete}
            className={cn(
              'flex-1 px-3 py-2 transition-colors',
              viewMode === 'grid'
                ? 'flex flex-col items-center text-sm'
                : 'flex justify-center gap-2'
            )}
          >
            <FaTrashAlt className='w-5 h-5' />
            <span>{'Delete'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
