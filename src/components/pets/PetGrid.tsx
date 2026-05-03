'use client';

import { useState } from 'react';
import { IoFilter } from 'react-icons/io5';
import { PetCard } from './PetCard';
import { Pet } from '@/types/supabase.types';
import { Pagination } from '@/components/layout/Pagination';
import { Button, Paragraph } from '@/components/ui';
import { PetFilters } from './PetFilters';
import { PetSearch } from './PetSearch';
import { usePetsFilters } from '@/hooks/usePetsFilters';
import { DownloadAllPetsButton } from '@/components/layout';

export const PetGrid = ({ pets }: { pets: Pet[] }) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const {
    searchTerm,
    handleSearch,
    activeFilterCount,
    handleResetFilters,
    filters,
    uniqueStats,
    handleFilterChange,
    paginatedPets,
    filteredPets,
    totalPages,
    currentPage,
    handlePageChange,
  } = usePetsFilters(pets);

  return (
    <div className='space-y-2.5'>
      {/* search + filters button */}
      <div className='flex gap-2.5'>
        <PetSearch searchTerm={searchTerm} onSearchChange={handleSearch} />
        <Button
          onClick={() => setFiltersOpen((prev) => !prev)}
          className='flex items-center self-end gap-2.5 py-2'
        >
          <IoFilter className='h-4 w-4' />
          <span>{'Filters'}</span>
          {activeFilterCount > 0 && (
            <span className='flex items-center justify-center w-4 h-4 rounded-full bg-light-grey text-xs font-bold'>
              {activeFilterCount}
            </span>
          )}
        </Button>
        {(activeFilterCount > 0 || searchTerm) && (
          <Button
            variant='secondary'
            onClick={handleResetFilters}
            className='flex items-center self-end gap-2.5 py-2'
          >
            {'Reset'}
          </Button>
        )}
      </div>

      {/* Filters panel */}
      {filtersOpen && (
        <PetFilters
          filters={filters}
          uniqueStats={uniqueStats}
          onFilterChange={handleFilterChange}
        />
      )}

      {/* Result count */}
      <div className='flex justify-between items-center mt-2.5 lg:mt-5 mb-2.5'>
        <Paragraph className='text-sm text-foreground/50'>
          {`Showing ${paginatedPets.length} of ${filteredPets.length} pets`}
        </Paragraph>
        <DownloadAllPetsButton />
      </div>

      {/* Grid */}
      {paginatedPets.length > 0 ? (
        <div className='bg-light-grey rounded-lg p-2.5 lg:p-5 mt-2.5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 lg:gap-5'>
          {paginatedPets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      ) : (
        <div className='text-center py-20 bg-light-grey rounded-lg'>
          <Paragraph className='text-foreground/65 font-medium'>
            {'No pets found'}
          </Paragraph>
          <Paragraph className='text-sm text-foreground/40 mt-1'>
            {'Try adjusting your search or filters'}
          </Paragraph>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl={''}
          onPageChange={handlePageChange}
          className='mt-5'
        />
      )}
    </div>
  );
};
