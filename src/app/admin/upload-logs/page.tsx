import { getTournamentsForForm } from '@/features/supabase/actions/tournaments';
import { UploadForm } from '@/features/supabase/components/admin/UploadForm';
import { Container, Heading, Paragraph, Divider } from '@/components/ui';

export async function generateMetadata() {
  return {
    title: 'Upload Battle Logs',
    robots: { index: false, follow: false },
  };
}

export default async function UploadLogsPage() {
  const {
    success,
    status,
    message,
    data: { tournaments },
  } = await getTournamentsForForm();

  if (!success) {
    return (
      <>
        <Divider alignment='horizontal' color='light-grey' height='0.5' />
        <Container className='text-center lg:px-5'>
          <Heading
            as='h2'
            className='text-red mb-5'
          >{`Error ${status}!`}</Heading>
          <Paragraph>{message}</Paragraph>
        </Container>
      </>
    );
  }

  if (!tournaments) {
    return (
      <>
        <Divider alignment='horizontal' color='light-grey' height='0.5' />
        <Container className='text-center lg:px-5'>
          <Heading as='h2' className='text-red mb-5'>
            {'No Leagues Found!'}
          </Heading>
          <Paragraph>
            {
              'Please create a league first before you upload the battle logs to create matches and statistics.'
            }
          </Paragraph>
        </Container>
      </>
    );
  }

  return (
    <>
      <Divider alignment='horizontal' color='light-grey' height='0.5' />
      <Container className='px-0 lg:px-0 my-0'>
        <Heading as='h2' className='text-foreground/80 mb-5'>
          {'Upload Battle Logs & Create Match'}
        </Heading>
        <UploadForm tournaments={tournaments || []} />
      </Container>
    </>
  );
}
