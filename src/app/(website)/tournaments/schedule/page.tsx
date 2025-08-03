import { Links } from '@/lib/types';
import { Container, PageHeading, PageMenu } from '@/components/ui';

export async function generateMetadata() {
  return {
    title: 'Tournaments Schedule',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL!}/tournaments/schedule`,
    },
  };
}

export default function TournamentsSchedulePage() {
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
      url: '/tournaments/stages',
      text: 'Stages',
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
      <PageHeading heading='Tournament Schedule'>
        <PageMenu links={links} />
      </PageHeading>
      <div>{'Schedule Page'}</div>
    </Container>
  );
}
