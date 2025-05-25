import Image from 'next/image';
import { Container, Heading, Paragraph } from '@/components/ui';

export default function HomePage() {
  return (
    <>
      <div className='w-full h-full lg:h-[768px]'>
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_URL!}/images/tourney-logo.png`}
          alt='Home page banner logo'
          width={1000}
          height={1000}
          className='w-full h-full object-contain'
          priority
        />
      </div>
      <Container className='text-center'>
        <Heading>{'WoW Pet Community'}</Heading>
        <Paragraph className='text-xl'>
          {
            'The World of Warcraft community for all things Battle Pets and Pet Battling! '
          }
        </Paragraph>
        <Paragraph className='mb-10 text-xl'>
          {'Also the Community for the Pet Battle PvP Tournaments!'}
        </Paragraph>
      </Container>
    </>
  );
}
