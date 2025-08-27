import { LinksGallery } from '@/components/homepage/LinksGallery';
import { PartnerGallery } from '@/components/homepage/PartnerGallery';
import { Container } from '@/components/ui';
import { partnersData } from '@/lib/partners';
import { getVisibleAnnouncement } from '@/mongoDB/actions/announcements';
import { getVisibleSignup } from '@/mongoDB/actions/signups';
import { getVisibleSchedule } from '@/mongoDB/actions/schedules';
import { AnnouncementSection } from '@/components/admin/cms/homepage/announcements/AnnouncementSection';
import { SignupSection } from '@/components/admin/cms/homepage/signups/SignupsSection';
import { ScheduleSection } from '@/components/admin/cms/homepage/schedules/schedulesSection';

export default async function HomePage() {
  const announcement = await getVisibleAnnouncement();
  const signup = await getVisibleSignup();
  const schedule = await getVisibleSchedule();

  return (
    <>
      {announcement.announcement && announcement?.announcement?.isVisible ? (
        <Container className='my-5 pb-5'>
          <AnnouncementSection announcement={announcement.announcement} />
        </Container>
      ) : null}
      {/* TODO: recent news/articles/guides section here */}
      {(signup.signup && signup.signup.isVisible) ||
      (schedule.schedule && schedule.schedule.isVisible) ? (
        <div className='my-5 py-5 bg-light-grey'>
          <Container className='flex flex-col space-y-5'>
            {signup.signup && signup.signup.isVisible ? (
              <SignupSection signup={signup.signup} />
            ) : null}
            {schedule.schedule && schedule.schedule.isVisible ? (
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
