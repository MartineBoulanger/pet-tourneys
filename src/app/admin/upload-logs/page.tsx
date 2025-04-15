import { getTournaments } from '@/supabase/actions/tournaments';
import { UploadForm } from '@/components/admin';
import { Container } from '@/components/ui';

import { Metadata } from 'next';

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
        <h1 className='text-red'>{`Error ${status}!`}</h1>
        <p>{message}</p>
      </Container>
    );
  }

  if (!tournaments) {
    return (
      <Container className='text-center'>
        <h1 className='text-red'>{'No Tournaments Found!'}</h1>
        <p>
          {
            'Please create a tournament first before you upload the battle logs to create matches and statistics.'
          }
        </p>
      </Container>
    );
  }

  return (
    <Container className='max-w-[1024px]'>
      <h1 className='text-center'>{'Pet Battle Logs Uploader'}</h1>
      <p className='text-center mb-5'>
        {
          'Upload the PvP pet battle logs and pet usage, fill in the match information, and track the match and logs.'
        }
      </p>
      <UploadForm tournaments={tournaments || []} />
    </Container>
  );
}
