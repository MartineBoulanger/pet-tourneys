import { LinksGallery } from '@/components/homepage/LinksGallery';
import { PartnerGallery } from '@/components/homepage/PartnerGallery';
import { Container } from '@/components/ui';
import { partnersData } from '@/lib/partners';
import { getVisibleAnnouncement } from '@/mongoDB/actions/announcements';
import { AnnouncementSection } from '@/components/admin/cms/homepage/announcements/AnnouncementSection';

export default async function HomePage() {
  const announcement = await getVisibleAnnouncement();

  return (
    <>
      <Container className='my-5 flex flex-col space-y-5 lg:space-y-10'>
        {/* TODO: recent news/articles/guides section here */}
        {announcement.announcement && announcement?.announcement?.isVisible ? (
          <AnnouncementSection announcement={announcement.announcement} />
        ) : null}
        {/* TODO: schedule and sign ups section here */}
        <LinksGallery />
      </Container>
      <PartnerGallery data={partnersData} />
    </>
  );
}
