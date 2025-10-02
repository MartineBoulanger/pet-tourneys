import { Container, Divider, Heading } from '@/components/ui';
import { PagesManager } from '@/features/cms/components/pages/PagesManager';

export default async function AdminPagesPage() {
  return (
    <>
      <Divider alignment='horizontal' color='light-grey' height='0.5' />
      <Container className='px-0 lg:px-0 my-0'>
        <Heading as='h2' className='text-foreground/80 mb-5'>
          {'Manage Guides, Articles & Pet Reviews'}
        </Heading>
        <PagesManager />
      </Container>
    </>
  );
}
