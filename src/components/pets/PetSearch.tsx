import { IoSearch, IoClose } from 'react-icons/io5';
import { Button, Input } from '@/components/ui';

export function PetSearch({
  onSearchChange,
  searchTerm,
}: {
  onSearchChange: (term: string) => void;
  searchTerm: string;
}) {
  return (
    <div className='relative flex-1'>
      <IoSearch className='absolute left-3 top-10 -translate-y-1/2 text-humanoid' />
      <Input
        type='text'
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder='Search by name, ID, ability or expansion...'
        className='px-10 w-full'
        label='Search Battle Pets'
        id='search-battle-pets'
        name='search-battle-pets'
      />
      {searchTerm && (
        <Button
          variant='link'
          onClick={() => onSearchChange('')}
          className='absolute right-3 top-10 -translate-y-1/2 text-background hover:text-humanoid transition-colors'
        >
          <IoClose />
        </Button>
      )}
    </div>
  );
}
