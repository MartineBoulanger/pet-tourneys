import { TournamentForm } from '@/components/admin';
import { Container, Heading, Paragraph } from '@/components/ui';
import { getTournament } from '@/supabase/actions/tournaments';
import { PageParams } from '@/types';

export async function generateMetadata() {
  return {
    title: 'Edit Tournament',
    robots: { index: false, follow: false },
  };
}

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
      <Container className='text-center lg:px-5'>
        <Heading className='text-red'>{`Error ${status}!`}</Heading>
        <Paragraph>{message}</Paragraph>
      </Container>
    );
  }

  if (!tournament) {
    return (
      <Container className='text-center lg:px-5'>
        <Heading className='text-red'>{'No Tournament Found!'}</Heading>
        <Paragraph>
          {'Please create a tournament first before you can edit one.'}
        </Paragraph>
      </Container>
    );
  }

  return (
    <Container className='w-full flex flex-col justify-center max-w-[512px]'>
      <Heading className='text-center'>{'Edit Tournament'}</Heading>
      <TournamentForm initialData={tournament} />
    </Container>
  );
}
