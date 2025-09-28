import { Container, Divider, Heading } from '@/components/ui';
import { RulesManager } from '@/features/cms/components/rules/RulesManager';

export default async function AdminRulesPage() {
  return (
    <>
      <Divider alignment='horizontal' color='light-grey' height='0.5' />
      <Container className='px-0 lg:px-0 my-0'>
        <Heading as='h2' className='text-foreground/80 mb-5'>
          {'Manage League Rules'}
        </Heading>
        <RulesManager />
      </Container>
    </>
  );
}
