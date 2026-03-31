import { Container, Heading } from '@/components/ui';
import { RulesList } from '@/components/cms/rules/RulesList';
import { DownloadRulesButton } from '@/components/layout/DownloadRulesButton';

export async function generateMetadata() {
  return {
    title: 'League Rules',
    description: "Pet Masters League's seasonal rules",
    alternates: {
      canonical: `${process.env.BASE_URL!}/leagues/rules`,
    },
  };
}

export default function LeaguesRulesPage() {
  return (
    <Container className='mb-5 px-2.5 lg:px-5 lg:mb-10'>
      <Heading className='mb-5 lg:mb-0'>{'League Rules'}</Heading>
      <div className='flex items-center justify-center mb-2.5 mt-5'>
        <DownloadRulesButton />
      </div>
      <RulesList />
    </Container>
  );
}
