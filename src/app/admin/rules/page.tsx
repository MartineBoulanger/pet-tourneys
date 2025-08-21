import { Container, Divider, Heading } from '@/components/ui';
import { RulesManager } from '@/components/admin/cms/rules/RulesManager';

export default async function AdminRulesPage() {
  return (
    <>
      <Divider alignment='horizontal' color='light-grey' height='0.5' />
      <Container className='px-0 lg:px-0'>
        <Heading as='h2' className='font-sans tracking-normal text-xl mb-2.5'>
          {'Manage Tournament Rules'}
        </Heading>
        <RulesManager />
      </Container>
    </>
  );
}
