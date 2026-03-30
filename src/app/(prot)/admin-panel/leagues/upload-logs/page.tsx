import { getLeaguesForForm } from '@/actions/supabase/api-schema/leagues/getLeagues';
import { UploadForm } from '@/components/admin-panel/league-management/UploadForm';
import { Container, Heading, Paragraph } from '@/components/ui';

export default async function AdminUploadLogsPage() {
  const { error, data } = await getLeaguesForForm();

  if (error) {
    return (
      <Container className='text-center'>
        <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
        <Heading as='h2' className='text-red mb-5'>{`Error!`}</Heading>
        <Paragraph>{error}</Paragraph>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container className='text-center lg:px-5'>
        <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
        <Heading as='h2' className='text-red mb-5'>
          {'No Leagues Found!'}
        </Heading>
        <Paragraph>
          {
            'Please create a league first before you upload the battle logs to create matches and statistics.'
          }
        </Paragraph>
      </Container>
    );
  }

  return (
    <Container className='px-0 lg:px-0 my-0'>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <Heading as='h2' className='mb-5 font-brutals-normal mx-auto'>
        {'Create Match'}
      </Heading>
      <Paragraph className='text-foreground/50 text-center mb-2.5'>
        {'Create new battle logs, pet usage, and match information.'}
      </Paragraph>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <UploadForm leagues={data || []} />
    </Container>
  );
}
