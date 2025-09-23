'use client';

import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoGrid, IoList } from 'react-icons/io5';
import { searchImagesInFolder } from '@/features/cloudinary/actions/cloudinary';
import { Button, Input } from '@/components/ui';
import { CloudinaryImage, ImagesToolbarProps } from '../types';

export function ImagesToolbar({
  folder,
  images,
  setImages,
  selected,
  setSelected,
  viewMode,
  setViewMode,
  onBulkDelete,
}: ImagesToolbarProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearch = async (term: string) => {
    const result = await searchImagesInFolder(term, folder);
    if (result.success) setImages(result.data as CloudinaryImage[]);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleBulkDelete = async () => {
    if (
      selected &&
      selected.length > 0 &&
      confirm(`Delete ${selected.length} images?`)
    ) {
      for (const id of selected) {
        onBulkDelete([id]);
      }
      setSelected([]);
    }
  };

  const selectAllImages = () => {
    setSelected(images.map((img) => img.public_id));
  };

  const clearSelection = () => {
    setSelected([]);
  };

  return (
    <div className='bg-background rounded-lg shadow-md p-2.5 lg:p-5 mb-2.5 lg:mb-5'>
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2.5 lg:gap-5'>
        {/* Search */}
        <div className='flex flex-col sm:flex-row gap-2.5 lg:gap-5 flex-1'>
          <div className='relative'>
            <FaSearch className='absolute left-3 top-2/3 transform -translate-y-1/2 text-humanoid w-4 h-4' />
            <Input
              label='Search images'
              name='search'
              id='search'
              type='search'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10'
            />
          </div>
        </div>

        {/* Actions */}
        <div className='flex flex-wrap items-center gap-2.5'>
          {selected && selected.length > 0 ? (
            <>
              <span className='text-sm text-foreground/50'>
                {selected.length}
                {' image(s) selected'}
              </span>
              <Button
                onClick={handleBulkDelete}
                variant='secondary'
                className='px-3 py-2.5'
              >
                {'Delete Selected'}
              </Button>
              <Button
                onClick={clearSelection}
                variant='link'
                className='px-3 py-2.5 border'
              >
                {'Clear Selection'}
              </Button>
            </>
          ) : null}

          {viewMode ? (
            <Button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className='p-2.5'
              title='Toggle View Mode'
              aria-label='Toggle View Mode'
            >
              {viewMode === 'grid' ? (
                <IoList className='w-5 h-5' />
              ) : (
                <IoGrid className='w-5 h-5' />
              )}
            </Button>
          ) : null}
        </div>
      </div>

      {images.length > 0 ? (
        <div className='mt-2.5 lg:mt-5 flex items-center gap-4'>
          <span className='text-sm text-foreground/50'>{`Showing ${images.length} images`}</span>
          {selected && selected.length > 0 ? (
            <Button
              onClick={selectAllImages}
              variant='link'
              className='text-sm border-b-2 rounded-none'
            >
              {'Select All'}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
