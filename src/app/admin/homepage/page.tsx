import { Container, Heading, Divider } from '@/components/ui';
import { AnnouncementsManager } from '@/features/cms/components/homepage/announcements/AnnouncementManager';
import { SignupsManager } from '@/features/cms/components/homepage/signups/SignupsManager';
import { SchedulesManager } from '@/features/cms/components/homepage/schedules/SchedulesManager';

export default async function AdminHomePageSectionsPage() {
  return (
    <>
      <Divider alignment='horizontal' color='light-grey' height='0.5' />
      <Container className='px-0 lg:px-0'>
        <Heading as='h2' className='font-sans tracking-normal text-xl mb-2.5'>
          {'Manage Homepage Sections'}
        </Heading>
        <div className='space-y-2.5 lg:space-y-5'>
          <div>
            <Heading
              as='h3'
              className='font-sans tracking-normal text-lg text-center mb-2.5'
            >
              {'Manage Announcements'}
            </Heading>
            <AnnouncementsManager />
          </div>
          <Divider alignment='horizontal' color='light-grey' height='0.5' />
          <div>
            <Heading
              as='h3'
              className='font-sans tracking-normal text-lg text-center mb-2.5'
            >
              {'Manage Signups'}
            </Heading>
            <SignupsManager />
          </div>
          <Divider alignment='horizontal' color='light-grey' height='0.5' />
          <div>
            <Heading
              as='h3'
              className='font-sans tracking-normal text-lg text-center mb-2.5'
            >
              {'Manage Schedules'}
            </Heading>
            <SchedulesManager />
          </div>
        </div>
      </Container>
    </>
  );
}
