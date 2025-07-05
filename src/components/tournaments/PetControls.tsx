'use client';

import { useState } from 'react';
import { IoFilter, IoSearch } from 'react-icons/io5';
import { Input, Select, Button, Option, Checkbox } from '@/components/ui';
import { cn } from '@/utils/cn';
import { PetControlsProps, SortOption } from '../statistics/types';

export function PetControls({
  searchTerm,
  onSearchChange,
  sortOption,
  onSortChange,
  filters,
  onFilterChange,
  onResetFilters,
  uniqueStats,
  isMatchView = false,
}: PetControlsProps) {
  const [showFilters, setShowFilters] = useState(false);

  let sortOptions: SortOption[];

  if (isMatchView) {
    sortOptions = [
      { value: 'name-asc', label: 'Name (A-Z)' },
      { value: 'name-desc', label: 'Name (Z-A)' },
      { value: 'played-asc', label: 'Total Played (Low-High)' },
      { value: 'played-desc', label: 'Total Played (High-Low)' },
      { value: 'kills-asc', label: 'Kills (Low-High)' },
      { value: 'kills-desc', label: 'Kills (High-Low)' },
      { value: 'deaths-asc', label: 'Deaths (Low-High)' },
      { value: 'deaths-desc', label: 'Deaths (High-Low)' },
      { value: 'swaps-asc', label: 'Swaps (Low-High)' },
      { value: 'swaps-desc', label: 'Swaps (High-Low)' },
    ];
  } else {
    sortOptions = [
      { value: 'name-asc', label: 'Name (A-Z)' },
      { value: 'name-desc', label: 'Name (Z-A)' },
      { value: 'played-asc', label: 'Total Played (Low-High)' },
      { value: 'played-desc', label: 'Total Played (High-Low)' },
      { value: 'kills-asc', label: 'Kills (Low-High)' },
      { value: 'kills-desc', label: 'Kills (High-Low)' },
      { value: 'winrate-asc', label: 'Win Rate (Low-High)' },
      { value: 'winrate-desc', label: 'Win Rate (High-Low)' },
      { value: 'deaths-asc', label: 'Deaths (Low-High)' },
      { value: 'deaths-desc', label: 'Deaths (High-Low)' },
      { value: 'swaps-asc', label: 'Swaps (Low-High)' },
      { value: 'swaps-desc', label: 'Swaps (High-Low)' },
      { value: 'matches-asc', label: 'Total Matches (Low-High)' },
      { value: 'matches-desc', label: 'Total Matches (High-Low)' },
      { value: 'wins-asc', label: 'Wins (Low-High)' },
      { value: 'wins-desc', label: 'Wins (High-Low)' },
      { value: 'losses-asc', label: 'Losses (Low-High)' },
      { value: 'losses-desc', label: 'Losses (High-Low)' },
    ];
  }

  return (
    <div className='bg-light-grey p-2.5 rounded-lg mb-2.5 lg:mb-5 shadow-sm'>
      <div
        className={cn(
          'flex flex-col lg:flex-row lg:items-center gap-2.5 lg:gap-5 p-2.5 bg-background',
          showFilters ? 'rounded-t-lg' : 'rounded-lg'
        )}
      >
        <div className='relative flex-1'>
          <IoSearch className='absolute left-3 top-10 -translate-y-1/2 text-humanoid' />
          <Input
            type='text'
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder='Search pets by name, ability, or pet id...'
            className='pl-10 w-full'
            label='Search Pets'
            id='search-pets'
            name='search-pets'
          />
        </div>
        <Select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value)}
          className='w-full lg:w-64'
          label='Sort Pets'
          id='sort-pets'
          name='sort-pets'
        >
          {sortOptions.map((option) => (
            <Option
              key={option.value}
              value={option.value}
              label={option.label}
            />
          ))}
        </Select>
        <div className='flex self-end gap-2.5 lg:gap-5'>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className='flex items-center gap-2.5 p-2'
          >
            <IoFilter />
            {'Filters'}
          </Button>
          <Button variant='secondary' className='p-2' onClick={onResetFilters}>
            {'Clear'}
          </Button>
        </div>
      </div>

      {showFilters ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 lg:gap-5 p-2.5  bg-background rounded-b-lg border-t border-t-light-grey'>
          {/* Type Filter */}
          <Select
            value={filters.type}
            onChange={(e) => onFilterChange('type', e.target.value)}
            label='Type'
            id='type'
            name='type'
          >
            <Option value='' label='All Types' />
            {uniqueStats.types.map((type) => (
              <Option key={type} value={type} label={type} />
            ))}
          </Select>

          {/* Breed Filter */}
          <Select
            value={filters.breed}
            onChange={(e) => onFilterChange('breed', e.target.value)}
            label='Breed'
            id='breed'
            name='breed'
          >
            <Option value='' label='All Breeds' />
            {uniqueStats.breeds.map((breed) => (
              <Option key={breed} value={breed} label={breed} />
            ))}
          </Select>

          {/* Expansion Filter */}
          <Select
            value={filters.expansion}
            onChange={(e) => onFilterChange('expansion', e.target.value)}
            label='Expansion'
            id='expansion'
            name='expansion'
          >
            <Option value='' label='All Expansions' />
            {uniqueStats.expansions.map((expansion) => (
              <Option key={expansion} value={expansion} label={expansion} />
            ))}
          </Select>

          {/* Source Filter */}
          <Select
            value={filters.source}
            onChange={(e) => onFilterChange('source', e.target.value)}
            label='Source'
            id='source'
            name='source'
          >
            <Option value='' label='All Sources' />
            {uniqueStats.sources.map((source) => (
              <Option key={source} value={source} label={source} />
            ))}
          </Select>

          {/* Availability Filter */}
          <div className='space-y-1'>
            <Checkbox
              label='Is Tradable?'
              id='tradable'
              name='tradable'
              checked={filters.tradable}
              onChange={(e) => onFilterChange('tradable', e.target.checked)}
            />
            <Checkbox
              label='Is Capturable?'
              id='capturable'
              name='capturable'
              checked={filters.capturable}
              onChange={(e) => onFilterChange('capturable', e.target.checked)}
            />
          </div>

          <div className='space-y-1'>
            <Checkbox
              label='Is Alliance Only?'
              id='isAllianceOnly'
              name='isAllianceOnly'
              checked={filters.isAllianceOnly}
              onChange={(e) =>
                onFilterChange('isAllianceOnly', e.target.checked)
              }
            />
            <Checkbox
              label='Is Horde Only?'
              id='isHordeOnly'
              name='isHordeOnly'
              checked={filters.isHordeOnly}
              onChange={(e) => onFilterChange('isHordeOnly', e.target.checked)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
