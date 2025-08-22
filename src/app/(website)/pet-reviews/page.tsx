import { notFound } from 'next/navigation';
import { Container, Heading, Paragraph } from '@/components/ui';
import { PageCard } from '@/components/contentful/PageCard';
import { getAllPages } from '@/contentful/actions/getAllPages';
import { AllPagesFragment } from '@/components/contentful/types';

export async function generateMetadata() {
  return {
    title: 'Pet Reviews',
    alternates: {
      canonical: `${process.env.BASE_URL!}/pet-reviews`,
    },
  };
}

export default async function GuidesPage() {
  const pages: AllPagesFragment[] = await getAllPages(false, 'Pet Review');

  if (!pages) notFound();
  // TODO: add pagination with 12 page cards  per page -> see commercial LLBG for implementing pagination for Contentful
  return (
    <Container className='lg:px-5'>
      <Heading className='text-center'>{'Pet Reviews'}</Heading>
      <Paragraph className='max-w-[700px] text-center mx-auto'>
        {
          'You want to know what pet is good for Pet Battle PvP? Or check out if the new pets are any good? Here you can find the reviews of pets that are good for PvP. You can read each review, and also see what abilities are the best to use for the pet, etc.'
        }
      </Paragraph>
      {/* Page cards list */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-10 lg:mt-20 gap-2.5 sm:gap-5'>
        {pages && pages.length > 0 ? (
          pages.map((page) => <PageCard key={page.sys.id} page={page} />)
        ) : (
          <div className='col-span-full p-2.5 lg:p-5 bg-background rounded-lg text-center col-start-1'>
            {'No pet reviews are online yet. Please come back later!'}
          </div>
        )}
      </div>
    </Container>
  );
}
