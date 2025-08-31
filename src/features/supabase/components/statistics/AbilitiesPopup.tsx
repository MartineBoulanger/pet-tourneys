import { Heading } from '@/components/ui';
import { abilitiesCategoryNames } from '@/features/supabase/utils/analyzeToolHelpers';

export const AbilitiesPopup = ({
  category,
  abilities,
}: {
  category: string;
  abilities: string[] | undefined;
}) => {
  return (
    <>
      <Heading className='max-w-[450px] break-words mb-2.5 lg:mb-5'>
        {abilitiesCategoryNames[
          category as keyof typeof abilitiesCategoryNames
        ] || category}
        {' Abilities'}
      </Heading>
      <div className='py-2.5 lg:py-5 bg-background rounded-lg shadow-md'>
        <ul className='max-h-[400px] overflow-y-auto'>
          {abilities &&
            abilities.map((ability, index) => (
              <li
                key={`${ability}-${index}`}
                className='px-2.5 lg:px-5 py-1.5 border-b border-light-grey last:border-none'
              >
                {ability}
              </li>
            ))}
        </ul>
      </div>
    </>
  );
};
