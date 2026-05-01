'use client';

import { useState, useMemo } from 'react';
import { IoFilter } from 'react-icons/io5';
import { PetCard } from './PetCard';
import {
  Pet,
  PetFilters as Filters,
  UniqueStats,
  AffixConfig,
} from '@/types/supabase.types';
import { Pagination } from '@/components/layout/Pagination';
import { Button, Paragraph } from '@/components/ui';
import { PetFilters } from './PetFilters';
import { PetSearch } from './PetSearch';

const PETS_PER_PAGE = 30;

const defaultFilters: Filters = {
  type: '',
  expansion: '',
  source: '',
  breed: '',
  tradable: false,
  capturable: false,
  isAllianceOnly: false,
  isHordeOnly: false,
  isVanity: false,
  battleOnly: false,
  pmlAffix: '',
};

export const PetGrid = ({ pets }: { pets: Pet[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const uniqueStats = useMemo<UniqueStats>(() => {
    const types = new Set<string>();
    const expansions = new Set<string>();
    const sources = new Set<string>();
    const breeds = new Set<string>();

    pets.forEach((pet) => {
      if (pet.type) types.add(pet.type);
      if (pet.expansion) expansions.add(pet.expansion);
      if (pet.source) sources.add(pet.source);
      if (pet.breeds) pet.breeds.forEach((b) => breeds.add(b.trim()));
    });

    return {
      types: Array.from(types).sort(),
      expansions: Array.from(expansions).sort(),
      sources: Array.from(sources).sort(),
      breeds: Array.from(breeds).sort(),
    };
  }, [pets]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.type) count++;
    if (filters.expansion) count++;
    if (filters.source) count++;
    if (filters.breed) count++;
    if (filters.tradable) count++;
    if (filters.capturable) count++;
    if (filters.isAllianceOnly) count++;
    if (filters.isHordeOnly) count++;
    if (filters.isVanity) count++;
    if (filters.battleOnly) count++;
    if (filters.pmlAffix) count++;
    return count;
  }, [filters]);

  // affixes set hardcoded here -- change or add when needed
  const PML_AFFIXES: Record<string, AffixConfig> = {
    affix1: {
      types: ['Aquatic', 'Undead', 'Dragonkin', 'Mechanical', 'Magic'],
      expansions: [],
    },
    affix2: {
      types: [],
      expansions: [
        'The Burning Crusade',
        'Battle for Azeroth',
        'Shadowlands',
        'Cataclysm',
        'Warlods of Dreanor',
        'Midnight',
      ],
    },
    affix3: {
      types: ['Beast', 'Critter', 'Elemental', 'Flying', 'Humanoid'],
      expansions: [],
    },
    affix4: {
      types: [],
      expansions: [
        'Classic',
        'Wrath of the Lich King',
        'Legion',
        'Mists of Pandaria',
        'Dragonflight',
        'Midnight',
      ],
    },
  };

  const filteredPets = useMemo(() => {
    const lower = searchTerm.toLowerCase();

    return pets.filter((pet) => {
      if (searchTerm) {
        const matchesName = pet.name.toLowerCase().includes(lower);
        const matchesId = pet.id === Number(searchTerm);
        const matchesExpansion = pet.expansion?.toLowerCase().includes(lower);
        const matchesAbility = [
          pet.ability_1,
          pet.ability_2,
          pet.ability_3,
          pet.ability_4,
          pet.ability_5,
          pet.ability_6,
        ].some((a) => a?.toLowerCase().includes(lower));

        if (
          !matchesName &&
          !matchesId &&
          !matchesExpansion &&
          !matchesAbility
        ) {
          return false;
        }
      }

      if (filters.type && pet.type !== filters.type) return false;
      if (filters.expansion && pet.expansion !== filters.expansion)
        return false;
      if (filters.source && pet.source !== filters.source) return false;
      if (
        filters.breed &&
        !(pet.breeds && pet.breeds.map((b) => b.trim()).includes(filters.breed))
      )
        return false;
      if (filters.tradable && !pet.is_tradable) return false;
      if (filters.capturable && !pet.is_capturable) return false;
      if (filters.isAllianceOnly && !pet.is_alliance) return false;
      if (filters.isHordeOnly && !pet.is_horde) return false;
      if (filters.isVanity && !pet.is_vanity) return false;
      if (filters.battleOnly && pet.is_vanity) return false;
      if (filters.pmlAffix && pet.is_vanity) return false;

      // affixes filters, add here more when needed
      if (filters.pmlAffix) {
        const affix = PML_AFFIXES[filters.pmlAffix];
        if (affix.types.length > 0 && !affix.types.includes(pet.type))
          return false;
        if (
          affix.expansions.length > 0 &&
          !affix.expansions.includes(pet.expansion)
        )
          return false;
      }

      return true;
    });
  }, [pets, searchTerm, filters]);

  const totalPages = Math.ceil(filteredPets.length / PETS_PER_PAGE);
  const paginatedPets = filteredPets.slice(
    (currentPage - 1) * PETS_PER_PAGE,
    currentPage * PETS_PER_PAGE,
  );

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      <Paragraph className='text-sm text-foreground/50'>
        {`Showing ${paginatedPets.length} of ${filteredPets.length} pets`}
      </Paragraph>

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
