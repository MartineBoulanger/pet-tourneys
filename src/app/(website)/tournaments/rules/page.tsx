import { RulesPage } from '@/components/cms/RulesPage';
import { Links } from '@/lib/types';
import { Container, PageHeading, PageMenu } from '@/components/ui';

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
      url: `/tournaments/stages`,
      text: 'Stages',
    },
    {
      id: 3,
      url: '/tournaments/schedule',
      text: 'Schedule',
    },
    {
      id: 4,
      url: '/tournaments/sign-ups',
      text: 'Sign-ups',
    },
    {
      id: 5,
      url: '/tournaments',
      text: 'Tournaments List',
    },
  ];

  return (
    <Container className='mb-5 lg:mb-10'>
      <PageHeading heading='Tournament Rules'>
        <PageMenu links={links} />
      </PageHeading>
      <RulesPage />
    </Container>
  );
}
