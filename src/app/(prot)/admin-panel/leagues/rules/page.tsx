import { Container, Heading, Paragraph } from '@/components/ui';
import { RulesManager } from '@/components/admin-panel/league-management/RulesManager';

export default async function AdminRulesPage() {
  return (
    <Container className='px-0 lg:px-0 my-0'>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <Heading as='h2' className='mb-5 font-brutals-normal mx-auto'>
        {'Manage League Rules'}
      </Heading>
      <Paragraph className='text-foreground/50 text-center mb-2.5'>
        {'Manage all rules for the league rules page'}
      </Paragraph>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <RulesManager />
    </Container>
  );
}
