import { LinksGallery, PartnerGallery } from '@/components/homepage';
import { Container } from '@/components/ui';
import { partnersData } from '@/lib/partners';

export default function HomePage() {
  return (
    <>
      <Container className='my-5 lg:mb-10 flex flex-col'>
        {/* TODO: recent news/articles/guides section here */}
        {/* TODO: if trailer/announcements/teasers section here */}
        {/* TODO: schedule and sign ups section here */}
        {/* <div className='w-full h-full lg:max-w-[80%] 2xl:max-w-[65%] mx-auto rounded-lg overflow-hidden shadow-md'>
          <img
            src={`${process.env.BASE_URL!}/images/promo-poster.png`}
            alt='Tournament Promo Poster'
            width={1000}
            height={1000}
            className='w-full h-full object-cover'
            loading='eager'
          />
        </div> */}
        <LinksGallery />
      </Container>
      <PartnerGallery data={partnersData} />
    </>
  );
}
