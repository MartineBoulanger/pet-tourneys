import { LinksGallery } from '@/components/homepage/LinksGallery';
import { PartnerGallery } from '@/components/homepage/PartnerGallery';
import { Container } from '@/components/ui';
import { partnersData } from '@/lib/partners';
import { getVisibleAnnouncement } from '@/features/cms/actions/announcements';
import { getVisibleSignup } from '@/features/cms/actions/signups';
import { getVisibleSchedule } from '@/features/cms/actions/schedules';
import { getRecentPagesByTypes } from '@/features/cms/actions/pages';
import { AnnouncementSection } from '@/features/cms/components/homepage/announcements/AnnouncementSection';
import { SignupSection } from '@/features/cms/components/homepage/signups/SignupsSection';
import { ScheduleSection } from '@/features/cms/components/homepage/schedules/schedulesSection';
import { RecentPagesSection } from '@/features/cms/components/homepage/RecentPagesSection';

export default async function HomePage() {
  const announcement = await getVisibleAnnouncement();
  const signup = await getVisibleSignup();
  const schedule = await getVisibleSchedule();
  const data = await getRecentPagesByTypes([
    'articles',
    'pet-reviews',
    'guides',
  ]);

  return (
    <>
      {announcement.success &&
      announcement.announcement &&
      announcement?.announcement?.isVisible ? (
        <Container className='my-5 pb-5'>
          <AnnouncementSection announcement={announcement.announcement} />
        </Container>
      ) : null}
      <RecentPagesSection data={data} />
      {(signup.success && signup.signup && signup.signup.isVisible) ||
      (schedule.success && schedule.schedule && schedule.schedule.isVisible) ? (
        <div className='my-5 py-5 bg-light-grey'>
          <Container className='flex flex-col space-y-5'>
            {signup.success && signup.signup && signup.signup.isVisible ? (
              <SignupSection signup={signup.signup} />
            ) : null}
            {schedule.success &&
            schedule.schedule &&
            schedule.schedule.isVisible ? (
              <ScheduleSection schedule={schedule.schedule} />
            ) : null}
          </Container>
        </div>
      ) : null}
      <LinksGallery />
      <PartnerGallery data={partnersData} />
    </>
  );
}
