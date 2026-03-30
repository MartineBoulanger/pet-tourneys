import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { MdOutlineImageNotSupported } from 'react-icons/md';
import { Button, Checkbox, Heading } from '@/components/ui';
import { PetCardProps } from '@/types/supabase.types';
import { cn } from '@/utils/cn';
import Image from 'next/image';

export function PetCard({
  pet,
  selected,
  toggleSelect,
  onView,
  onEdit,
  viewMode,
  onDelete,
}: PetCardProps) {
  return (
    <div
      className={cn(
        ' bg-light-grey border border-foreground/30 rounded-lg overflow-hidden transition-all',
        selected.includes(pet.id) ? 'ring-2 ring-humanoid' : 'hover:scale-101',
        viewMode === 'list' ? 'flex items-center justify-between p-2.5' : '',
      )}
    >
      <div className='relative'>
        {/* Checkbox */}
        <div className='absolute top-2.5 left-2.5 z-10'>
          <Checkbox
            id={String(pet.id)}
            name={pet.name}
            checked={selected.includes(pet.id)}
            onChange={() => toggleSelect(pet.id)}
            className='w-5 h-5'
          />
        </div>

        {/* Image */}
        <div
          className={cn(
            viewMode === 'grid'
              ? 'aspect-square relative'
              : 'w-20 h-20 flex-shrink-0 rounded overflow-hidden',
          )}
        >
          {pet.image ? (
            <Image
              src={pet.image?.secure_url}
              alt={pet.name}
              className={cn(
                'w-full ',
                viewMode === 'list'
                  ? 'h-full object-contain'
                  : 'h-48 object-cover',
              )}
              width={80}
              height={80}
              unoptimized
            />
          ) : (
            <div
              className={cn(
                'w-full bg-dark-grey flex items-center justify-center ',
                viewMode === 'list' ? 'h-full' : 'h-48',
              )}
            >
              <MdOutlineImageNotSupported
                className={cn(viewMode === 'list' ? 'w-8 h-8' : 'w-20 h-20')}
              />
            </div>
          )}
        </div>
      </div>
      <div className={cn('p-2.5', viewMode === 'list' ? 'w-[300px]' : '')}>
        <Heading as='h3' className='font-bold mb-2 truncate'>
          {pet.name}
        </Heading>
        <div className='flex items-center justify-center gap-2.5 mt-2.5'>
          <Button
            onClick={() => onView(pet)}
            className={cn(
              'flex-1 bg-foreground hover:bg-foreground/80 text-background rounded transition-colors',
              viewMode === 'grid'
                ? 'flex flex-col items-center text-sm'
                : 'flex justify-center gap-2',
            )}
            title='View Details'
          >
            <FaEye className='w-5 h-5' />
          </Button>
          <Button
            onClick={() => onEdit(pet)}
            className={cn(
              'flex-1 transition-colors',
              viewMode === 'grid'
                ? 'flex flex-col items-center text-sm'
                : 'flex justify-center gap-2',
            )}
            title='Edit Pet'
          >
            <FaEdit className='w-5 h-5' />
          </Button>
          <Button
            onClick={() => {
              if (confirm(`Delete ${pet.name}?`)) {
                onDelete(pet.id);
              }
            }}
            variant='secondary'
            className={cn(
              'flex-1 transition-colors',
              viewMode === 'grid'
                ? 'flex flex-col items-center text-sm'
                : 'flex justify-center gap-2',
            )}
            title='Delete Pet'
          >
            <FaTrash className='w-5 h-5' />
          </Button>
        </div>
      </div>
    </div>
  );
}
