import { PetSlotProps } from '@/types/rematch-import.types';
import { Paragraph } from '../ui';

export function PetSlot({ value }: PetSlotProps) {
  if (!value) {
    return (
      <div className='overflow-hidden rounded-md border border-foreground/60 text-sm shadow-sm'>
        <Paragraph className='block px-2 py-1 text-humanoid'>
          {'empty'}
        </Paragraph>
      </div>
    );
  }

  if (value.startsWith('Z')) {
    return (
      <div className='overflow-hidden rounded-md border border-humanoid text-sm bg-background shadow-sm'>
        <Paragraph className='block px-2 py-1 text-humanoid'>{value}</Paragraph>
      </div>
    );
  }

  const abilities = value.slice(0, 3);
  const species = value.slice(3);

  return (
    <div className='flex overflow-hidden rounded-md border border-humanoid bg-background text-sm shadow-sm'>
      <span className='px-2 py-1 tracking-wider border-r border-humanoid text-foreground'>
        {abilities}
      </span>

      <span className='px-2 py-1 tracking-wider text-foreground'>
        {species}
      </span>
    </div>
  );
}
