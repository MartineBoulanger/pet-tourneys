import { Links } from '@/lib/types';
import { Container, PageHeading, PageMenu } from '@/components/ui';

export async function generateMetadata() {
  return {
    title: 'Tournaments Prizes',
    alternates: {
      canonical: `${process.env.BASE_URL!}/tournaments/prizes`,
    },
  };
}

export default function TournamentsPrizesPage() {
  const links: Links = [
    {
      id: 1,
      url: `/tournaments/rules`,
      text: 'Rules',
    },
    {
      id: 2,
      url: '/tournaments',
      text: 'Tournaments List',
    },
  ];

  return (
    <Container>
      <PageHeading heading='Tournament Prizes'>
        <PageMenu links={links} />
      </PageHeading>
    </Container>
  );
}
