import { Heading } from '@/components/ui';
import { OverviewCard } from '../OverviewCard';
import { AbilitiesCard } from '../AbilitiesCard';
import { PetAbilitiesChartsProps } from '../types';

export const PetAbilitiesCharts = ({
  abilityStats,
}: PetAbilitiesChartsProps) => {
  if (!abilityStats) {
    return (
      <p className='text-center bg-background rounded-lg py-5'>
        {'No pet abilities data available.'}
      </p>
    );
  }

  return (
    <div className='mb-5 lg:mb-10 z-0'>
      <Heading as='h2' className='text-xl sm:text-3xl mb-2.5'>
        {'Overall Pet Abilities Statistics'}
      </Heading>
      <div className='flex flex-wrap flex-col md:flex-row gap-5 mb-5'>
        {abilityStats?.totalUniqueAbilitiesUsed ? (
          <OverviewCard
            title='Total Unique Abilities Used'
            value={abilityStats?.totalUniqueAbilitiesUsed}
          />
        ) : null}
      </div>
      <div className='bg-light-grey rounded-lg shadow-md p-2.5 sm:p-5'>
        <Heading as='h2' className='text-lg mb-2.5 font-sans'>
          {'Ability Per Category'}
        </Heading>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {Object.entries(abilityStats)
            .filter(
              ([key]) =>
                key !== 'categorizationLog' &&
                key !== 'totalUniqueAbilitiesUsed'
            )
            .filter(([_, abilities]) => abilities && abilities.length > 0)
            .map(([category, abilities], index) => {
              if (Array.isArray(abilities)) {
                return (
                  <AbilitiesCard
                    key={`${category}-${index}`}
                    category={category}
                    abilities={abilities}
                  />
                );
              }
              return (
                <p
                  key={`${category}-${index}`}
                  className='text-center bg-background rounded-lg py-5'
                >
                  {'No abilities data available.'}
                </p>
              );
            })}
        </div>
      </div>
    </div>
  );
};
