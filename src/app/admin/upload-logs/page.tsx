import { Metadata } from 'next';
import { getTournaments } from '@/supabase/actions/tournaments';
import { UploadForm } from '@/components/admin';
import { Container, Heading, Paragraph } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Upload Logs',
  robots: { index: false, follow: false },
};

export default async function UploadLogsPage() {
  const {
    success,
    status,
    message,
    data: { tournaments },
  } = await getTournaments();

  if (!success) {
    return (
      <Container className='text-center'>
        <Heading className='text-red'>{`Error ${status}!`}</Heading>
        <Paragraph>{message}</Paragraph>
      </Container>
    );
  }

  if (!tournaments) {
    return (
      <Container className='text-center'>
        <Heading className='text-red'>{'No Tournaments Found!'}</Heading>
        <Paragraph>
          {
            'Please create a tournament first before you upload the battle logs to create matches and statistics.'
          }
        </Paragraph>
      </Container>
    );
  }

  return (
    <Container className='max-w-[1024px]'>
      <Heading className='text-center'>{'Pet Battle Logs Uploader'}</Heading>
      <Paragraph className='text-center mb-5'>
        {
          'Upload the PvP pet battle logs and pet usage, fill in the match information, and track the match and logs.'
        }
      </Paragraph>
      <UploadForm tournaments={tournaments || []} />
    </Container>
  );
}
