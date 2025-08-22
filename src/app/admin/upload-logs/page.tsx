import { getTournamentsForForm } from '@/supabase/actions/tournaments';
import { UploadForm } from '@/components/admin/UploadForm';
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
            className='font-sans tracking-normal text-xl text-center text-red mb-2.5'
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
          <Heading
            as='h2'
            className='font-sans tracking-normal text-xl text-center text-red mb-2.5'
          >
            {'No Tournaments Found!'}
          </Heading>
          <Paragraph>
            {
              'Please create a tournament first before you upload the battle logs to create matches and statistics.'
            }
          </Paragraph>
        </Container>
      </>
    );
  }

  return (
    <>
      <Divider alignment='horizontal' color='light-grey' height='0.5' />
      <Container className='max-w-[1024px]'>
        <Heading
          as='h2'
          className='font-sans tracking-normal text-xl text-center mb-2.5'
        >
          {'Pet Battle Logs Upload Form'}
        </Heading>
        <UploadForm tournaments={tournaments || []} />
      </Container>
    </>
  );
}
