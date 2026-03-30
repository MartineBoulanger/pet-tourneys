import { LeagueForm } from '@/components/admin-panel/league-management/LeagueForm';
import { Container, Heading, Paragraph } from '@/components/ui';

export default function NewTournamentPage() {
  return (
    <Container className='px-0 lg:px-0 my-0'>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <Heading as='h2' className='mb-5 font-brutals-normal mx-auto'>
        {'Create League'}
      </Heading>
      <Paragraph className='text-foreground/50 text-center mb-2.5'>
        {'Create a new league'}
      </Paragraph>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <LeagueForm />
    </Container>
  );
}
