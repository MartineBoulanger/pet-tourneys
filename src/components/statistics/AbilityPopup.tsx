'use client';

import { Button, Heading } from '@/components/ui';

export const AbilityPopup = ({
  category,
  abilities,
  open,
  onClose,
}: {
  category: string;
  abilities: string[];
  open: boolean;
  onClose: () => void;
}) => {
  return (
    // <Dialog open={open} onOpenChange={onClose}>
    open && (
      <div className='sm:max-w-[600px]'>
        <Heading>
          {category.replace(/([A-Z])/g, ' $1').trim()} Abilities
        </Heading>
        <div className='grid gap-2 py-4'>
          <ul className='space-y-2 max-h-[400px] overflow-y-auto'>
            {abilities.map((ability, index) => (
              <li
                key={`${ability}-${index}`}
                className='p-2 border-b border-gray-200'
              >
                {ability}
              </li>
            ))}
          </ul>
        </div>
        <div className='flex justify-end'>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    )
    // </Dialog>
  );
};
