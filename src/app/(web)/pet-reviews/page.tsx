import { notFound } from 'next/navigation';
import { MdOutlineMenuBook } from 'react-icons/md';
import { Container, Heading, Paragraph } from '@/components/ui';
import { PagesList } from '@/components/cms/pages/PagesList';
import { getPages } from '@/actions/supabase/cms-schema/pages/getPages';

export async function generateMetadata() {
  return {
    title: 'Pet Reviews',
    description:
      'Pet reviews about pet battling, and battle pets, and WoW pet news',
    alternates: {
      canonical: `${process.env.BASE_URL!}/pet-reviews`,
    },
  };
}

export default async function PetReviewsPage() {
  const { success, data, error } = await getPages('pet-reviews');

  if (!success && error) notFound();

  return (
    <Container className='lg:px-5'>
      <Heading className='text-center'>{'Pet Reviews'}</Heading>
      <Paragraph className='max-w-[700px] text-center mx-auto'>
        {
          'You want to know what pet is good for Pet Battle PvP? Or check out if the new pets are any good? Here you can find the reviews of pets that are good for PvP. You can read each review, and also see what abilities are the best to use for the pet, etc.'
        }
      </Paragraph>
      {data && data.length > 0 ? (
        <PagesList pages={data} type='pet-reviews' />
      ) : (
        // TODO: make this a separate component because it is used on 3 pages
        <div className='bg-light-grey rounded-lg mt-5 lg:mt-10 p-2.5 lg:p-5'>
          <div className='flex flex-col items-center justify-center text-center px-2.5 lg:px-5 py-20 bg-background rounded-lg'>
            <MdOutlineMenuBook className='text-humanoid mb-6 w-24 h-24' />
            <Heading as='h2' className='mb-5 text-foreground/80'>
              {`No pet reviews pages available`}
            </Heading>
            <Paragraph className='text-foreground/50'>
              {`There are no pet reviews pages available at this moment, please come back later.`}
            </Paragraph>
          </div>
        </div>
      )}
    </Container>
  );
}
