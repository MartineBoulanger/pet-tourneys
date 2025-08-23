import { Links } from '@/lib/types';
import { Container, PageHeading, PageMenu } from '@/components/ui';
import { RulesList } from '@/components/admin/cms/rules/RulesList';

export async function generateMetadata() {
  return {
    title: 'League Rules',
    alternates: {
      canonical: `${process.env.BASE_URL!}/tournaments/rules`,
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
      text: 'Leagues List',
    },
  ];

  return (
    <Container className='mb-5 lg:mb-10'>
      <PageHeading heading='League Rules'>
        <PageMenu links={links} />
      </PageHeading>
      <RulesList />
    </Container>
  );
}
