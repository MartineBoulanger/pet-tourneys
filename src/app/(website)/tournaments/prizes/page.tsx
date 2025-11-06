import { Links } from '@/lib/types';
import { Container, PageHeading, PageMenu } from '@/components/ui';
import { PrizesList } from '@/features/cms/components/prizes/PrizesList';

export async function generateMetadata() {
  return {
    title: 'League Prizes',
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
      url: `/tournaments/hall-of-fame`,
      text: 'Hall of Fame',
    },
    {
      id: 3,
      url: '/tournaments',
      text: 'Leagues List',
    },
  ];

  return (
    <Container>
      <PageHeading heading='League Prizes'>
        <PageMenu links={links} />
      </PageHeading>
      <PrizesList />
    </Container>
  );
}
