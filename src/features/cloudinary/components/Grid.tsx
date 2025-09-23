'use client';

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
  return (
    <div className='bg-background rounded-lg shadow-md p-2.5 lg:p-5'>
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 lg:gap-5'
            : 'space-y-2.5'
        }
      >
        {images.map((img) => (
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
        ))}
      </div>
    </div>
  );
}
