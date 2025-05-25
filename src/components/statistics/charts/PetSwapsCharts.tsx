import { PetSwapsChartsProps } from '../types';
import { swapsColors } from '@/utils/constants';
import { RadarGraph, PieGraph } from '../graphs';
import { Heading } from '@/components/ui';
import { transformPetSwapData } from '@/utils/analyzeToolHelpers';

export const PetSwapsCharts = ({ battleStats }: PetSwapsChartsProps) => {
  if (!battleStats) {
    return (
      <p className='text-center bg-background rounded-lg py-5'>
        {'No pet swaps data available.'}
      </p>
    );
  }

  // Total swaps made by the players
  const swaps = transformPetSwapData(battleStats.totalPetSwaps);

  // Swaps per pet, sliced to only show the top 5
  const petSwaps = Object.entries(battleStats.petSwapDetails)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  return (
    <div className='mb-5 sm:mb-10'>
      <Heading as='h2' className='text-xl sm:text-3xl mb-2.5'>
        {'Overall Pet Swaps Statistics'}
      </Heading>
      <div className='bg-light-grey rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-5 p-2.5 sm:p-5'>
        <div>
          <Heading as='h2' className='mb-2.5 text-lg font-sans'>
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
        <div>
          <Heading as='h2' className='mb-2.5 text-lg font-sans'>
            {'Top 6 Pet Swaps'}
          </Heading>
          {battleStats.petSwapDetails && (
            <RadarGraph
              data={petSwaps}
              tooltip={'Total Swaps: '}
              legendText={'Times Swapped'}
              radarName={'Top 6 Pet Swaps'}
              showLegend
            />
          )}
        </div>
      </div>
    </div>
  );
};
