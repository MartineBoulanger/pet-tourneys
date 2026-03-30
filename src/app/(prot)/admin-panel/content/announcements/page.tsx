import { Container, Paragraph, Heading } from '@/components/ui';
import { AnnouncementsManager } from '@/components/admin-panel/content-management/AnnouncementManager';

export default function AdminAnnouncementsPage() {
  return (
    <Container className='px-0 lg:px-0'>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <Heading as='h2' className='mb-5 font-brutals-normal mx-auto'>
        {'Manage Announcements'}
      </Heading>
      <Paragraph className='text-foreground/50 text-center mb-2.5'>
        {'Manage all announcements on the homepage'}
      </Paragraph>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <AnnouncementsManager />
    </Container>
  );
}
