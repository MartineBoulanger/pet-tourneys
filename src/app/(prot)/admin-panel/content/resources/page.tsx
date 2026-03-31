import { Container, Paragraph, Heading } from '@/components/ui';
import { ResourcesManager } from '@/components/admin-panel/content-management/ResourcesManager';

export default function AdminResourcesPage() {
  return (
    <Container className='px-0 lg:px-0'>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <Heading as='h2' className='mb-5 font-brutals-normal mx-auto'>
        {'Manage Resources'}
      </Heading>
      <Paragraph className='text-foreground/50 text-center mb-2.5'>
        {'Manage all resources sections on the resources page'}
      </Paragraph>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <ResourcesManager />
    </Container>
  );
}
