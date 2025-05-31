import Image from 'next/image';
import { LinkCards } from './LinkCards';
import { Heading } from '@/components/ui';

export const TopView = () => {
  return (
    <div className='flex flex-col items-center gap-2.5 lg:gap-5'>
      <Heading className='text-center tracking-wider'>
        {'WoW Pet Community'}
      </Heading>
      <div className='flex flex-col lg:flex-row items-center gap-2.5 lg:gap-5'>
        <div className='w-full lg:w-1/2 h-full rounded-lg overflow-hidden shadow-md'>
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_URL!}/images/promo-poster.png`}
            alt='Tournament Promo Poster'
            width={1000}
            height={1000}
            className='w-full h-full object-cover'
            priority
          />
        </div>
        <LinkCards />
      </div>
    </div>
  );
};
