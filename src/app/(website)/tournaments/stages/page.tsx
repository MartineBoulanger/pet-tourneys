import { Links } from '@/lib/types';
import { Container, PageHeading, PageMenu } from '@/components/ui';

export async function generateMetadata() {
  return {
    title: 'Tournaments Stages',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL!}/tournaments/stages`,
    },
  };
}

export default function TournamentsStagesPage() {
  const links: Links = [
    {
      id: 1,
      url: `/tournaments/rules`,
      text: 'Rules',
    },
    {
      id: 2,
      url: `/tournaments/prizes`,
      text: 'Prizes',
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
    <Container>
      <PageHeading heading='Tournament Stages'>
        <PageMenu links={links} />
      </PageHeading>
      <div>{'Stages Page'}</div>
    </Container>
  );
}
