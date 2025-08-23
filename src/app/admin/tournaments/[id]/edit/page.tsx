import { TournamentForm } from '@/components/admin/tournaments/TournamentForm';
import { Container, Divider, Heading, Paragraph } from '@/components/ui';
import { getTournament } from '@/supabase/actions/tournaments';
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
            className='font-sans tracking-normal text-xl text-red text-center mb-2.5'
          >{`Error ${status}!`}</Heading>
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
          <Heading
            as='h2'
            className='font-sans tracking-normal text-xl text-red text-center mb-2.5'
          >
            {'No League Found!'}
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
      <Container className='w-full flex flex-col justify-center max-w-[512px]'>
        <Heading
          as='h2'
          className='font-sans tracking-normal text-xl text-center mb-2.5'
        >
          {'Edit League'}
        </Heading>
        <TournamentForm initialData={tournament} />
      </Container>
    </>
  );
}
