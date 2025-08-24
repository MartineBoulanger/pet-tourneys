import { LinksGallery } from '@/components/homepage/LinksGallery';
import { PartnerGallery } from '@/components/homepage/PartnerGallery';
import { Container } from '@/components/ui';
import { partnersData } from '@/lib/partners';

export default function HomePage() {
  return (
    <>
      <Container className='my-5 lg:mb-10 flex flex-col'>
        {/* TODO: recent news/articles/guides section here */}
        {/* TODO: if trailer/announcements/teasers section here */}
        {/* TODO: schedule and sign ups section here */}
        <LinksGallery />
      </Container>
      <PartnerGallery data={partnersData} />
    </>
  );
}
