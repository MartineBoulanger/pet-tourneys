import { Heading, Paragraph } from '@/components/ui';
import { AnalyzeToolForm } from '@/components/analyze-tool/AnalyzeToolForm';

export async function generateMetadata() {
  return {
    title: 'Analyze Tool',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL!}/analyze-tool`,
    },
  };
}

export default function AnalyzerPage() {
  return (
    <div className='container mx-auto py-8'>
      <Heading className='text-center'>
        {'Pet Battle PvP Logs Analyzer'}
      </Heading>
      <Paragraph className='text-center mb-2.5 max-w-[600px] mx-auto'>
        {'Analyze your personal pet battle PvP logs.'}
      </Paragraph>
      <Paragraph className='text-center mb-5 max-w-[600px] mx-auto'>
        {
          'Only battle logs and pet usage summary from the PetBattlePvPTournamentLogger addon are viable to analyze.'
        }
      </Paragraph>
      <AnalyzeToolForm />
    </div>
  );
}
