import {
  PetFiltersProps,
  SelectFilterProps,
  CheckboxFilterProps,
} from '@/types/components.types';
import { Select, Option, Checkbox } from '@/components/ui';

function SelectFilter({
  label,
  filterKey,
  value,
  options,
  onChange,
}: SelectFilterProps) {
  return (
    <Select
      label={label}
      id={label}
      name={label}
      value={value}
      onChange={(e) => onChange(filterKey, e.target.value)}
    >
      <Option label='All' value='' />
      {options.map((opt) => (
        <Option key={opt} value={opt} label={opt} />
      ))}
    </Select>
  );
}

function CheckboxFilter({
  label,
  filterKey,
  checked,
  onChange,
}: CheckboxFilterProps) {
  return (
    <Checkbox
      label={label}
      id={label}
      name={label}
      checked={checked}
      onChange={(e) => onChange(filterKey, e.target.checked)}
    />
  );
}

export function PetFilters({
  filters,
  uniqueStats,
  onFilterChange,
}: PetFiltersProps) {
  return (
    <div className='bg-background border border-medium-grey rounded-lg p-4 space-y-4'>
      {/* Select filters grid */}
      <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
        <SelectFilter
          label='Type'
          filterKey='type'
          value={filters.type}
          options={uniqueStats.types}
          onChange={onFilterChange}
        />
        <SelectFilter
          label='Expansion'
          filterKey='expansion'
          value={filters.expansion}
          options={uniqueStats.expansions}
          onChange={onFilterChange}
        />
        <SelectFilter
          label='Source'
          filterKey='source'
          value={filters.source}
          options={uniqueStats.sources}
          onChange={onFilterChange}
        />
        <SelectFilter
          label='Breed'
          filterKey='breed'
          value={filters.breed}
          options={uniqueStats.breeds}
          onChange={onFilterChange}
        />
      </div>

      {/* Checkbox filters row */}
      <div className='flex flex-wrap gap-x-6 gap-y-2 pt-2 border-t border-medium-grey'>
        <CheckboxFilter
          label='Tradable only'
          filterKey='tradable'
          checked={filters.tradable}
          onChange={onFilterChange}
        />
        <CheckboxFilter
          label='Can be caged'
          filterKey='capturable'
          checked={filters.capturable}
          onChange={onFilterChange}
        />
        <CheckboxFilter
          label='Alliance only'
          filterKey='isAllianceOnly'
          checked={filters.isAllianceOnly}
          onChange={onFilterChange}
        />
        <CheckboxFilter
          label='Horde only'
          filterKey='isHordeOnly'
          checked={filters.isHordeOnly}
          onChange={onFilterChange}
        />
        <CheckboxFilter
          label='Non Combat Pets'
          filterKey='isVanity'
          checked={filters.isVanity}
          onChange={onFilterChange}
        />
      </div>
    </div>
  );
}
