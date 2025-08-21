import { Links } from '@/lib/types';
import { Container, PageHeading, PageMenu } from '@/components/ui';
import { RulesList } from '@/components/admin/cms/rules/RulesList';

export async function generateMetadata() {
  return {
    title: 'Tournament Rules',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL!}/tournaments/rules`,
    },
  };
}

export default function TournamentsRulesPage() {
  const links: Links = [
    {
      id: 1,
      url: `/tournaments/prizes`,
      text: 'Prizes',
    },
    {
      id: 2,
      url: '/tournaments',
      text: 'Tournaments List',
    },
  ];

  return (
    <Container className='mb-5 lg:mb-10'>
      <PageHeading heading='Tournament Rules'>
        <PageMenu links={links} />
      </PageHeading>
      {/* TODO: make a sidebar navigation to navigate to each rule set */}
      <RulesList />
    </Container>
  );
}
