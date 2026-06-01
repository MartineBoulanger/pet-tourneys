import { TopPet } from '@/types/supabase.types';
import { Paragraph } from '@/components/ui';

export function PetBadge({ pet, label }: { pet: TopPet; label: string }) {
  return (
    <div className='flex items-center gap-3 bg-light-grey rounded-lg shadow-sm p-2.5'>
      {pet.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={pet.image}
          alt={pet.name}
          className='w-10 h-10 rounded-full object-cover shrink-0'
        />
      ) : (
        <span className='text-2xl shrink-0'>🐾</span>
      )}
      <div className='min-w-0'>
        <Paragraph className='text-xs font-bold uppercase tracking-widest truncate'>
          {label}
        </Paragraph>
        <Paragraph className='font-bold text-humanoid text-sm truncate'>
          {pet.name}
        </Paragraph>
        <Paragraph className='text-xs text-foreground/50'>
          {`${pet.total_played} uses`}
        </Paragraph>
      </div>
    </div>
  );
}
