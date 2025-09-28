import { TournamentForm } from '@/features/supabase/components/admin/tournaments/TournamentForm';
import { getTournament } from '@/features/supabase/actions/tournaments';
import { Container, Divider, Heading, Paragraph } from '@/components/ui';
import { PageParams } from '@/types';

export default async function EditTournamentPage({
  params,
}: {
  params: PageParams;
}) {
  const { id } = await params;
  const {
    success,
    status,
    message,
    data: { tournament },
  } = await getTournament(id);

  if (!success) {
    return (
      <>
        <Divider alignment='horizontal' color='light-grey' height='0.5' />
        <Container className='text-center lg:px-5'>
          <Heading
            as='h2'
            className='text-red mb-5'
          >{`Error ${status}`}</Heading>
          <Paragraph>{message}</Paragraph>
        </Container>
      </>
    );
  }

  if (!tournament) {
    return (
      <>
        <Divider alignment='horizontal' color='light-grey' height='0.5' />
        <Container className='text-center lg:px-5'>
          <Heading as='h2' className='text-red mb-5'>
            {'No League Found'}
          </Heading>
          <Paragraph>
            {'Please create a league first before you can edit one.'}
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
          {'Edit League'}
        </Heading>
        <TournamentForm initialData={tournament} />
      </Container>
    </>
  );
}
