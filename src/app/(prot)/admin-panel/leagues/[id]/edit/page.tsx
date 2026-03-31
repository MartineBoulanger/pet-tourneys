import { Container, Heading, Paragraph } from '@/components/ui';
import { PageParams } from '@/types/global.types';
import { getLeague } from '@/actions/supabase/api-schema/leagues/getLeagues';
import { LeagueForm } from '@/components/admin-panel/league-management/LeagueForm';

export default async function AdminEditLeaguePage({
  params,
}: {
  params: PageParams;
}) {
  const { id } = await params;
  const { error, data } = await getLeague(id);

  if (error) {
    <Container className='text-center'>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <Heading as='h2' className='text-red mb-5'>{`Error!`}</Heading>
      <Paragraph>{error}</Paragraph>
    </Container>;
  }

  if (!data) {
    <Container className='text-center'>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <Heading as='h2' className='text-red mb-5'>
        {'No League Found!'}
      </Heading>
      <Paragraph>
        {'Please create a league first before you can edit one.'}
      </Paragraph>
    </Container>;
  }

  return (
    <Container className='px-0 lg:px-0'>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <Heading as='h2' className='mb-5 font-brutals-normal mx-auto'>
        {`Edit ${data?.name}`}
      </Heading>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      <LeagueForm initialData={data} />
    </Container>
  );
}
