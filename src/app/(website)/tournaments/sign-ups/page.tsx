import { Links } from '@/lib/types';
import { Container, PageHeading, PageMenu } from '@/components/ui';

export async function generateMetadata() {
  return {
    title: 'Tournaments Sign Ups',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL!}/tournaments/sign-ups`,
    },
  };
}

export default function TournamentsSignUpsPage() {
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
      url: '/tournaments/schedule',
      text: 'Schedule',
    },
    {
      id: 5,
      url: '/tournaments',
      text: 'Tournaments List',
    },
  ];

  return (
    <Container>
      <PageHeading heading='Tournament Sign-Ups'>
        <PageMenu links={links} />
      </PageHeading>
      <div>{'Sign-Ups Page'}</div>
    </Container>
  );
}
