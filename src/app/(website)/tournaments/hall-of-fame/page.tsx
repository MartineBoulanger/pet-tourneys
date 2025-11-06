import { notFound } from 'next/navigation';
import { HallOfFame } from '@/features/supabase/components/hall-of-fame/HallOfFame';
import { loadHallOfFameData } from '@/features/supabase/utils/loadJsonData';
import { Container, PageHeading, PageMenu } from '@/components/ui';
import { Links } from '@/lib/types';

export async function generateMetadata() {
  return {
    title: 'Hall of Fame - World Champions',
    alternates: {
      canonical: `${process.env.BASE_URL!}/tournaments/hall-of-fame`,
    },
  };
}

export default async function HallOfFamePage() {
  const data = await loadHallOfFameData();

  if (!data) return notFound();

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
      url: `/tournaments`,
      text: 'Leagues List',
    },
  ];

  return (
    <Container>
      <PageHeading heading='Hall of Fame'>
        <PageMenu links={links} />
      </PageHeading>
      <HallOfFame data={data} />
    </Container>
  );
}
