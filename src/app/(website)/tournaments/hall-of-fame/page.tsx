import { notFound } from 'next/navigation';
import { HofDesktop } from '@/features/supabase/components/hall-of-fame/HofDesktop';
import { HofMobile } from '@/features/supabase/components/hall-of-fame/HofMobile';
import { loadHallOfFameData } from '@/features/supabase/utils/loadJsonData';
import { Container, PageHeading, PageMenu } from '@/components/ui';
import { Links } from '@/lib/types';

export async function generateMetadata() {
  return {
    title: 'Hall of Fame',
    description: "Pet Masters League's Hall of Fame",
    alternates: {
      canonical: `${process.env.BASE_URL!}/tournaments/hall-of-fame`,
    },
  };
}

export default async function HallOfFamePage() {
  // TODO: make it possible to set this data in Supabase instead of hardcoding or MongoDB
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
      <div className='lg:hidden'>
        <HofMobile data={data} />
      </div>
      <div className='hidden lg:block'>
        <HofDesktop data={data} />
      </div>
    </Container>
  );
}
