import { TournamentForm } from '@/components/admin';
import { Container } from '@/components/ui';
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
      <Container className='text-center'>
        <h1 className='text-red'>{`Error ${status}!`}</h1>
        <p>{message}</p>
      </Container>
    );
  }

  if (!tournament) {
    return (
      <Container className='text-center'>
        <h1 className='text-red'>{'No Tournament Found!'}</h1>
        <p>{'Please create a tournament first before you can edit one.'}</p>
      </Container>
    );
  }

  return (
    <Container className='w-full flex flex-col justify-center max-w-[500px]'>
      <h1 className='text-center'>{'Edit Tournament'}</h1>
      <TournamentForm initialData={tournament} />
    </Container>
  );
}
