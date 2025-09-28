import { Container, Heading, Divider } from '@/components/ui';
import { ResourcesManager } from '@/features/cms/components/resources/ResourcesManager';

export default async function AdminResourcesPage() {
  return (
    <>
      <Divider alignment='horizontal' color='light-grey' height='0.5' />
      <Container className='px-0 lg:px-0 my-0'>
        <Heading as='h2' className='text-foreground/80 mb-5'>
          {'Manage All Resources'}
        </Heading>
        <ResourcesManager />
      </Container>
    </>
  );
}
