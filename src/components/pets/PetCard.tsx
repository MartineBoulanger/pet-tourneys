import Link from 'next/link';
import { Pet, PET_TYPE_COLORS } from '@/types/supabase.types';
import { Paragraph } from '@/components/ui';
import { Alliance } from '@/assets/Alliance';
import { Horde } from '@/assets/Horde';
import { PetCardImage } from './PetMedia';

export function PetCard({ pet }: { pet: Pet }) {
  const typeColor = PET_TYPE_COLORS[pet.type as keyof typeof PET_TYPE_COLORS];

  return (
    <Link
      href={`/pets/${pet.id}`}
      className='bg-background hover:bg-medium-grey rounded-lg p-2.5 lg:p-5 transition-colors duration-300 relative'
      title={pet.name}
      aria-label={pet.name}
    >
      <div
        role='link'
        tabIndex={0}
        className='group flex flex-col items-center justify-center gap-2.5'
      >
        {/* Image */}
        <PetCardImage pet={pet} />

        {/* Name */}
        <Paragraph className='text-lg text-center font-semibold leading-tight line-clamp-2'>
          {pet.name}
        </Paragraph>

        {/* Type badge */}
        <div
          className='text-xs font-medium px-2 py-0.5 rounded-full mt-auto'
          style={{
            color: typeColor,
            backgroundColor: `${typeColor}20`,
          }}
        >
          {pet.type}
        </div>

        {/* Expansion */}
        <Paragraph className='text-xs text-foreground/60 line-clamp-1'>
          {pet.expansion}
        </Paragraph>

        {/* Faction Icon */}
        {(pet.is_horde || pet.is_alliance) && (
          <div className='absolute top-2.5 right-2.5'>
            {pet.is_horde && <Horde className='w-10 h-10' />}
            {pet.is_alliance && <Alliance className='w-10 h-10' />}
          </div>
        )}
      </div>
    </Link>
  );
}
