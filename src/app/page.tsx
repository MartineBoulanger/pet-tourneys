import Image from 'next/image';
import { LinksGallery, PartnerGallery } from '@/components/homepage';
import { Container } from '@/components/ui';
import { partnersData } from '@/lib/partners';

export default function HomePage() {
  return (
    <>
      <div className='flex flex-col'>
        <LinksGallery />
        <Container className='lg:my-10 w-full h-full lg:max-w-[65%] mx-auto rounded-lg overflow-hidden shadow-md'>
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_URL!}/images/promo-poster.png`}
            alt='Tournament Promo Poster'
            width={1000}
            height={1000}
            className='w-full h-full object-cover'
            priority
          />
        </Container>
      </div>
      <PartnerGallery data={partnersData} />
    </>
  );
}
