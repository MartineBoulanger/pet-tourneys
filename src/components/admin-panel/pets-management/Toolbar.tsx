'use client';

import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoGrid, IoList } from 'react-icons/io5';
import { getPets } from '@/actions/supabase/pets-schema/pets/getPets';
import { searchPets } from '@/actions/supabase/pets-schema/pets/searchPets';
import { PetsToolbarProps } from '@/types/supabase.types';
import { Button, Input } from '@/components/ui';

export function PetsToolbar({
  pets,
  setPets,
  selected,
  setSelected,
  viewMode,
  setViewMode,
  onBulkDelete,
}: PetsToolbarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async (term: string) => {
    if (term.trim() === '') {
      const result = await getPets();
      if (result.success) {
        const data = result && result.data ? result.data : [];
        setPets(data);
      }
      return;
    }

    const result = await searchPets(term);
    if (result.success) {
      const data = result && result.data ? result.data : [];
      setPets(data);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleBulkDelete = async () => {
    if (selected.length > 0 && confirm(`Delete ${selected.length} pet(s)?`)) {
      onBulkDelete(selected);
      setSelected([]);
    }
  };

  const selectAllPets = () => {
    setSelected(pets.map((pet) => pet.id));
  };

  const clearSelection = () => {
    setSelected([]);
  };

  return (
    <div className='bg-background rounded-lg shadow-md p-2.5 lg:p-5 mb-2.5 lg:mb-5'>
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2.5 lg:gap-5'>
        <div className='flex flex-col sm:flex-row gap-2.5 lg:gap-5 flex-1'>
          <div className='relative'>
            <FaSearch className='absolute left-3 top-2/3 transform -translate-y-1/2 text-humanoid w-4 h-4' />
            <Input
              label='Search pets'
              name='search'
              id='search'
              type='search'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10'
            />
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-2.5'>
          {selected.length > 0 ? (
            <>
              <span className='text-sm text-foreground/50'>
                {selected.length} pet(s) selected
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
                variant='inverted'
                className='px-3 py-2.5'
              >
                {'Clear Selection'}
              </Button>
            </>
          ) : null}

          <Button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className='p-2.5'
            title='Toggle View Mode'
          >
            {viewMode === 'grid' ? (
              <IoList className='w-5 h-5' />
            ) : (
              <IoGrid className='w-5 h-5' />
            )}
          </Button>
        </div>
      </div>

      {pets.length > 0 && (
        <div className='mt-2.5 lg:mt-5 flex items-center gap-4'>
          <span className='text-sm text-foreground/70'>
            {`Showing ${pets.length} pet(s)`}
          </span>
          {selected.length === 0 && (
            <Button
              onClick={selectAllPets}
              variant='inverted'
              className='text-sm'
            >
              {'Select All'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
