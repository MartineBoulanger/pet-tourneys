import { Container, Heading, Divider } from '@/components/ui';
import { AnnouncementsManager } from '@/features/cms/components/homepage/announcements/AnnouncementManager';
import { SignupsManager } from '@/features/cms/components/homepage/signups/SignupsManager';
import { SchedulesManager } from '@/features/cms/components/homepage/schedules/SchedulesManager';

export default async function AdminHomePageSectionsPage() {
  return (
    <>
      <Divider alignment='horizontal' color='light-grey' height='0.5' />
      <Container className='px-0 lg:px-0 my-0'>
        <div className='space-y-2.5 lg:space-y-5'>
          <div>
            <Heading as='h2' className='text-foreground/80 mb-5'>
              {'Manage Announcements'}
            </Heading>
            <AnnouncementsManager />
          </div>
          <Divider alignment='horizontal' color='light-grey' height='0.5' />
          <div>
            <Heading as='h2' className='text-foreground/80 mb-5'>
              {'Manage Signups'}
            </Heading>
            <SignupsManager />
          </div>
          <Divider alignment='horizontal' color='light-grey' height='0.5' />
          <div>
            <Heading as='h2' className='text-foreground/80 mb-5'>
              {'Manage Schedules'}
            </Heading>
            <SchedulesManager />
          </div>
        </div>
      </Container>
    </>
  );
}
