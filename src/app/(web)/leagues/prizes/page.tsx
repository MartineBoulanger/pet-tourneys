import { Container, Heading } from '@/components/ui';
import { PrizesList } from '@/components/cms/prizes/PrizesList';

export async function generateMetadata() {
  return {
    title: 'League Prizes',
    description: "Pet Masters League's seasonal prizes",
    alternates: {
      canonical: `${process.env.BASE_URL!}/leagues/prizes`,
    },
  };
}

export default function LeaguesPrizesPage() {
  return (
    <Container>
      <Heading>{'League Prizes'}</Heading>
      <PrizesList />
    </Container>
  );
}
