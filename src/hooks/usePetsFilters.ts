'use client';

import { useState, useMemo } from 'react';
import {
  AffixConfig,
  Pet,
  PetFilters,
  UniqueStats,
} from '@/types/supabase.types';

const PETS_PER_PAGE = 30;

const defaultFilters: PetFilters = {
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
      'Warlords of Draenor',
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

export const usePetsFilters = (pets: Pet[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<PetFilters>(defaultFilters);
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

  return {
    uniqueStats,
    activeFilterCount,
    totalPages,
    currentPage,
    paginatedPets,
    searchTerm,
    filters,
    filteredPets,
    handleFilterChange,
    handleSearch,
    handleResetFilters,
    handlePageChange,
  };
};
