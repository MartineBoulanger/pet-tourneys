'use client';

import { Paragraph } from '@/components/ui';
import { ImagesGridProps } from '../types';
import { ImageCard } from './Card';

export function ImagesGrid({
  images,
  selected,
  setSelected,
  viewMode,
  onDelete,
  onView,
}: ImagesGridProps) {
  if (!images || !Array.isArray(images)) return null;

  return (
    <div className='bg-background rounded-t-lg shadow-md p-2.5 lg:p-5'>
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 lg:gap-5'
            : 'space-y-2.5'
        }
      >
        {images.length > 0 ? (
          images.map((img) => (
            <ImageCard
              key={img.public_id}
              image={img}
              selected={selected.includes(img.public_id)}
              toggleSelection={(id: string) =>
                setSelected(
                  selected.includes(id)
                    ? selected.filter((sid) => sid !== id)
                    : [...selected, id]
                )
              }
              onView={() => onView(img)}
              viewMode={viewMode}
              onDelete={onDelete}
            />
          ))
        ) : (
          <Paragraph className='w-full bg-light-grey py-2.5 px-5 rounded-lg col-span-full text-center'>
            {'No images found'}
          </Paragraph>
        )}
      </div>
    </div>
  );
}
