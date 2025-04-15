import Image from 'next/image';
import { Container } from '@/components/ui';

export default async function HomePage() {
  return (
    <>
      <div className='m-0 p-0 w-full h-[1024px]'>
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_URL!}/images/tourney-logo.png`}
          alt='Home page banner logo'
          width={1920}
          height={1920}
          className='w-full h-full object-scale-down'
          priority
        />
      </div>
      <Container className='text-center'>
        <h1>{'WoW Pet Community'}</h1>
        <p className='font-warcraft text-xl'>
          {
            'The World of Warcraft community for all things Battle Pets and Pet Battling! '
          }
        </p>
        <p className='mb-10 font-warcraft text-xl'>
          {'Also the Community for the Pet Battle PvP Tournaments!'}
        </p>
      </Container>
    </>
  );
}
