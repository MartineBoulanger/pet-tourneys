import { Container, Heading, Paragraph } from '@/components/ui';
import { HalloffameManager } from '@/components/admin-panel/league-management/HalloffameManager';

export default async function AdminHallOfFamePage() {
  return (
    <Container className='px-0 lg:px-0 my-0'>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <Heading as='h2' className='mb-5 font-brutals-normal mx-auto'>
        {'Manage Hall of Fame'}
      </Heading>
      <Paragraph className='text-foreground/50 text-center mb-2.5'>
        {'Manage the hall of fame from the leagues'}
      </Paragraph>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <HalloffameManager />
    </Container>
  );
}
