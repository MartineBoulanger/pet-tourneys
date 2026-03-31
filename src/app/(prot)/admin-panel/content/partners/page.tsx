import { Container, Paragraph, Heading } from '@/components/ui';
import { PartnersManager } from '@/components/admin-panel/content-management/PartnersManager';

export default function AdminPartnersPage() {
  return (
    <Container className='px-0 lg:px-0'>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <Heading as='h2' className='mb-5 font-brutals-normal mx-auto'>
        {'Manage Partners'}
      </Heading>
      <Paragraph className='text-foreground/50 text-center mb-2.5'>
        {'Manage all partners on the homepage carousel'}
      </Paragraph>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <PartnersManager />
    </Container>
  );
}
