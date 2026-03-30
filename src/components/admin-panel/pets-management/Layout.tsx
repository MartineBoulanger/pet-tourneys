'use client';
import { Paragraph } from '@/components/ui';
import { PetsLayoutProps } from '@/types/supabase.types';
import { PetCard } from './Card';

export function PetsLayout({
  pets,
  selected,
  setSelected,
  viewMode,
  onView,
  onEdit,
  onDelete,
}: PetsLayoutProps) {
  if (!pets || !Array.isArray(pets)) return null;

  const toggleSelect = (petId: number) => {
    setSelected(
      selected.includes(petId)
        ? selected.filter((id) => id !== petId)
        : [...selected, petId],
    );
  };

  return (
    <div className='bg-background rounded-t-lg shadow-md p-2.5 lg:p-5'>
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 lg:gap-5'
            : 'space-y-2.5'
        }
      >
        {pets.length > 0 ? (
          pets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              selected={selected}
              toggleSelect={toggleSelect}
              onView={() => onView(pet)}
              onEdit={() => onEdit(pet)}
              viewMode={viewMode}
              onDelete={onDelete}
            />
          ))
        ) : (
          <Paragraph className='w-full bg-light-grey py-2.5 px-5 rounded-lg col-span-full text-center'>
            {'No pets found'}
          </Paragraph>
        )}
      </div>
    </div>
  );
}
