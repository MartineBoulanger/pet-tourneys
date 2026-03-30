import { Container } from '@/components/ui';
import { getAnnouncement } from '@/actions/supabase/cms-schema/announcements/getAnnouncements';
import { getSignup } from '@/actions/supabase/cms-schema/signups/getSignups';
import { getSchedule } from '@/actions/supabase/cms-schema/schedules/getSchedules';
import { getRecentPages } from '@/actions/supabase/cms-schema/pages/getPages';
import { getPartners } from '@/actions/supabase/cms-schema/partners/getPartners';
import { AnnouncementsSection } from '@/components/cms/AnnouncementsSection';
import { SignupSection } from '@/components/cms/SignupsSection';
import { SchedulesSection } from '@/components/cms/SchedulesSection';
import { RecentPagesSection } from '@/components/cms/RecentPagesSection';
import { HomePageLinks } from '@/components/cms/HomePageLinks';
import { PartnerGallery } from '@/components/cms/PartnerGallery';

export default async function HomePage() {
  const announcement = await getAnnouncement();
  const signup = await getSignup();
  const schedule = await getSchedule();
  const { result } = await getRecentPages([
    'articles',
    'pet-reviews',
    'guides',
  ]);
  const partners = await getPartners();

  // separate the guides from the other pages here, because I only need the 2 latest guides and not the 5 latest guides.
  const pages = result?.filter((p) => p.type !== 'guides');
  const guides = result?.find((g) => g.type === 'guides')?.data ?? [];

  return (
    <>
      {announcement.success &&
      announcement.data &&
      announcement?.data?.isvisible ? (
        <Container className='my-0 py-10'>
          <AnnouncementsSection announcement={announcement.data} />
        </Container>
      ) : null}
      <RecentPagesSection result={pages || []} guides={guides} />
      {signup.success && signup.data && signup.data.isvisible ? (
        <div className='bg-light-grey'>
          <Container className='my-0 py-10'>
            <SignupSection signup={signup.data} />
          </Container>
        </div>
      ) : null}
      {schedule.success && schedule.data && schedule.data.isvisible ? (
        <div className='bg-light-grey'>
          <Container className='my-0 py-10'>
            <SchedulesSection schedule={schedule.data} />
          </Container>
        </div>
      ) : null}
      <HomePageLinks />
      <PartnerGallery data={partners?.data || []} />
    </>
  );
}
