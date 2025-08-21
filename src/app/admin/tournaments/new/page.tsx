import { TournamentForm } from '@/components/admin';
import { Container, Heading, Divider } from '@/components/ui';

export default function NewTournamentPage() {
  return (
    <>
      <Divider alignment='horizontal' color='light-grey' height='0.5' />
      <Container className='w-full flex flex-col justify-center max-w-[512px]'>
        <Heading
          as='h2'
          className='font-sans tracking-normal text-xl text-center mb-2.5'
        >
          {'Create Tournament Form'}
        </Heading>
        <TournamentForm />
      </Container>
    </>
  );
}
