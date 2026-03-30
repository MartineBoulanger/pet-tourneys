import { Heading, Paragraph, Container } from '@/components/ui';
import { AnalyzeToolForm } from '@/components/analyze-tool/AnalyzeToolForm';

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
      <Paragraph className='text-center max-w-[600px] mx-auto text-humanois'>
        {'Analyze your personal pet battle logs.'}
      </Paragraph>
      <Paragraph className='text-center mb-5 max-w-[800px] mx-auto text-sm text-foreground/70'>
        {
          'Only battle logs and pet usage summary from the PetMastersLeagueLogs addon are viable to analyze.'
        }
      </Paragraph>
      <AnalyzeToolForm />
    </Container>
  );
}
