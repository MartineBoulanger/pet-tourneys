import { HofDesktop } from '@/components/cms/hall-of-fame/HallofFameDesktop';
import { HofMobile } from '@/components/cms/hall-of-fame/HallofFameMobile';
import { Container, Heading } from '@/components/ui';
import { getHalloffame } from '@/actions/supabase/cms-schema/halloffame/getHalloffame';

export async function generateMetadata() {
  return {
    title: 'League Hall of Fame',
    description: "Pet Masters League's hall of fame",
    alternates: {
      canonical: `${process.env.BASE_URL!}/leagues/hall-of-fame`,
    },
  };
}

export default async function LeaguesHallOfFamePage() {
  const { data } = await getHalloffame();

  return (
    <Container>
      <Heading>{'Hall of Fame'}</Heading>
      <div className='lg:hidden'>
        <HofMobile data={data || []} />
      </div>
      <div className='hidden lg:block'>
        <HofDesktop data={data || []} />
      </div>
    </Container>
  );
}
