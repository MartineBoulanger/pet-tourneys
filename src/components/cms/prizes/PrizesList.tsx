import { IoMdTrophy } from 'react-icons/io';
import { getPrizes } from '@/actions/supabase/cms-schema/prizes/getPrizes';
import { Heading, Paragraph } from '@/components/ui';
import { PrizeSection } from './PrizeSection';

export async function PrizesList() {
  const { data } = await getPrizes();

  if (data?.length === 0) {
    return (
      <div className='bg-light-grey rounded-lg mt-5 p-2.5 lg:p-5'>
        <div className='flex flex-col items-center justify-center text-center px-2.5 lg:px-5 py-20 bg-background rounded-lg'>
          <IoMdTrophy className='text-humanoid mb-6 w-24 h-24' />
          <Heading
            as='h2'
            className='font-sans tracking-normal text-2xl font-bold mb-5'
          >
            {'No Prizes Available'}
          </Heading>
          <Paragraph className='text-foreground/50'>
            {
              'There are no prizes available at this moment, please come back later.'
            }
          </Paragraph>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-2.5 lg:space-y-5 bg-light-grey rounded-lg p-2.5 lg:p-5'>
      {data?.map((prize) => (
        <PrizeSection key={prize.id} prize={prize} />
      ))}
    </div>
  );
}
