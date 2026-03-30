import { Container, Paragraph, Heading } from '@/components/ui';
import { PagesManager } from '@/components/admin-panel/pages-management/PagesManager';

export default function AdminArticlesPage() {
  return (
    <Container className='px-0 lg:px-0'>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <Heading as='h2' className='mb-5 font-brutals-normal mx-auto'>
        {'Manage Articles'}
      </Heading>
      <Paragraph className='text-foreground/50 text-center mb-2.5'>
        {'Manage all article pages on the articles overview page'}
      </Paragraph>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <PagesManager type='articles' />
    </Container>
  );
}
