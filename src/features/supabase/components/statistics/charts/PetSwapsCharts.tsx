import { swapsColors } from '@/features/supabase/constants';
import { BarGraph } from '@/features/recharts-graphs/BarGraph';
import { PieGraph } from '@/features/recharts-graphs/PieGraph';
import { transformPetSwapData } from '@/features/supabase/utils/analyzeToolHelpers';
import { cn } from '@/utils/cn';
import { Heading, Paragraph } from '@/components/ui';
import { PetBattleLogProps } from '../types';
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

  const totalPetSwaps = battleStats?.totalPetSwaps || {};
  const petSwapDetails = battleStats?.petSwapDetails || {};

  // Total swaps made by the players
  const swaps = transformPetSwapData(totalPetSwaps) || [];
  const totalSwaps =
    swaps.length > 0
      ? swaps.map((t) => t?.value || 0).reduce((a, b) => a + b, 0)
      : 0;

  // Swaps per pet, sliced to only show the top 5
  const petSwaps = Object.entries(petSwapDetails)
    .map(([name, value]) => ({
      name,
      value: typeof value === 'number' ? value : 0,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
    .filter((pet) => pet.value > 0);

  return (
    <div className='mb-5 lg:mb-10'>
      <Heading as='h2' className='text-xl lg:text-3xl mb-2.5'>
        {'Overall Pet Swaps Statistics'}
      </Heading>
      <div className='flex flex-wrap flex-col md:flex-row gap-2.5 lg:gap-5 mb-5'>
        {totalSwaps > 0 ? (
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
            {swaps.length > 0 ? (
              <PieGraph
                data={swaps}
                tooltip={'Swaps done: '}
                fillColors={swapsColors}
              />
            ) : (
              <Paragraph className='text-center py-10'>
                {'No pet swap data available'}
              </Paragraph>
            )}
          </div>
        ) : null}
        <div>
          <Heading as='h2' className='mb-2.5 text-base lg:text-lg font-sans'>
            {'Top 5 Pet Swaps'}
          </Heading>
          {petSwaps.length > 0 ? (
            <BarGraph
              data={petSwaps}
              tooltip={'Total Swaps: '}
              color='#016630'
              color2='#f1f1f1'
            />
          ) : (
            <Paragraph className='w-full bg-background text-center py-5 rounded-lg'>
              {'No top 5 pet swap available'}
            </Paragraph>
          )}
        </div>
      </div>
    </div>
  );
};
