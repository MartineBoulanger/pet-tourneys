import { Container, Paragraph, Heading } from '@/components/ui';
import { SchedulesManager } from '@/components/admin-panel/content-management/SchedulesManager';

export default function AdminSchedulesPage() {
  return (
    <Container className='px-0 lg:px-0'>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <Heading as='h2' className='mb-5 font-brutals-normal mx-auto'>
        {'Manage Schedules'}
      </Heading>
      <Paragraph className='text-foreground/50 text-center mb-2.5'>
        {'Manage all schedules sections on the homepage'}
      </Paragraph>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <SchedulesManager />
    </Container>
  );
}
