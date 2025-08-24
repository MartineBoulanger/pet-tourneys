import { PetBattleLogProps } from '../types';
import { swapsColors } from '@/utils/constants';
import { BarGraph, PieGraph } from '../graphs';
import { Heading } from '@/components/ui';
import { transformPetSwapData } from '@/utils/analyzeToolHelpers';
import { cn } from '@/utils/cn';
import { OverviewCard } from '../OverviewCard';

export const PetSwapsCharts = ({
  battleStats,
  isMatchView = false,
}: PetBattleLogProps) => {
  if (!battleStats) {
    return (
      <p className='text-center bg-background rounded-lg py-5'>
        {'No pet swaps data available.'}
      </p>
    );
  }

  // Total swaps made by the players
  const swaps = transformPetSwapData(battleStats.totalPetSwaps);
  const totalSwaps = swaps && swaps.map((t) => t.value).reduce((a, b) => a + b);

  // Swaps per pet, sliced to only show the top 5
  const petSwaps = Object.entries(battleStats.petSwapDetails)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className='mb-5 lg:mb-10'>
      <Heading as='h2' className='text-xl lg:text-3xl mb-2.5'>
        {'Overall Pet Swaps Statistics'}
      </Heading>
      <div className='flex flex-wrap flex-col md:flex-row gap-2.5 lg:gap-5 mb-5'>
        {battleStats.totalPetSwaps ? (
          <OverviewCard title='Total Pet Swaps' value={totalSwaps} />
        ) : null}
      </div>
      <div
        className={cn(
          'bg-light-grey rounded-lg shadow-md grid grid-cols-1 lg:grid-cols-2 gap-2.5 lg:gap-5 p-2.5 lg:p-5',
          !isMatchView ? 'lg:grid-cols-1' : ''
        )}
      >
        {isMatchView ? (
          <div>
            <Heading as='h2' className='mb-2.5 text-base lg:text-lg font-sans'>
              {'Total Pet Swaps'}
            </Heading>
            {battleStats.totalPetSwaps && (
              <PieGraph
                data={swaps}
                tooltip={'Swaps done: '}
                fillColors={swapsColors}
              />
            )}
          </div>
        ) : null}
        <div>
          <Heading as='h2' className='mb-2.5 text-base lg:text-lg font-sans'>
            {'Top 5 Pet Swaps'}
          </Heading>
          {battleStats.petSwapDetails && (
            <BarGraph
              data={petSwaps}
              tooltip={'Total Swaps: '}
              color='#016630'
              color2='#f1f1f1'
            />
          )}
        </div>
      </div>
    </div>
  );
};
