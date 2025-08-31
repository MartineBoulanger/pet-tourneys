import { Heading, Paragraph, Container } from '@/components/ui';
import { AnalyzeToolForm } from '@/features/analyze-tool/AnalyzeToolForm';

export async function generateMetadata() {
  return {
    title: 'Analyze Tool',
    alternates: {
      canonical: `${process.env.BASE_URL!}/analyze-tool`,
    },
  };
}

export default function AnalyzerPage() {
  return (
    <Container className='lg:px-5'>
      <Heading className='text-center'>{'Pet Battle Logs Analyzer'}</Heading>
      <Paragraph className='text-center mb-2.5 max-w-[600px] mx-auto'>
        {'Analyze your personal pet battle logs.'}
      </Paragraph>
      <Paragraph className='text-center mb-5 max-w-[600px] mx-auto'>
        {
          'Only battle logs and pet usage summary from the PetBattlePvPTournamentLogger addon are viable to analyze.'
        }
      </Paragraph>
      <AnalyzeToolForm />
    </Container>
  );
}
