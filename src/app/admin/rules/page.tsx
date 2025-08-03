import { Container, Heading } from '@/components/ui';
import { RulesList } from '@/components/cms/RulesList';
import { AdminPanelButtons } from '@/components/admin';
import { getAllRules } from '@/mongoDB/actions/rules';

export default async function TournamentsRulesAdminPage() {
  const rules = await getAllRules();

  return (
    <Container>
      <Heading>{'Manage Tournament Rules'}</Heading>
      <AdminPanelButtons />
      <RulesList rules={rules} />
    </Container>
  );
}
