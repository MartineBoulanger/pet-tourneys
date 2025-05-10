import { notFound } from 'next/navigation';
import { Container, Heading, Paragraph } from '@/components/ui';
import { PageCard } from '@/components/contentful/PageCard';
import { getAllPages } from '@/contentful/actions/getAllPages';
import { AllPagesFragment } from '@/types';

export async function generateMetadata() {
  return {
    title: 'Pet Battle Articles',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL!}/articles`,
    },
  };
}

export default async function ArticlesPage() {
  const pages: AllPagesFragment[] = await getAllPages(false, 'Article');

  if (!pages) notFound();
  // TODO: add pagination with 12 page cards  per page -> see commercial LLBG for implementing pagination for Contentful
  return (
    <Container>
      <Heading className='text-center'>{'Pet Battle Articles'}</Heading>
      <Paragraph className='max-w-[700px] text-center mx-auto'>
        {
          'You want to learn how to and what pets to use in Pet Battling? Especially in PvP? You want to know what strategies would work, or which pet would be good to use? Then these articles could be of use for you. Have a look around, and hopefully you find what you were looking for.'
        }
      </Paragraph>
      {/* Page cards list */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-10 sm:mt-20 gap-5'>
        {pages && pages.length > 0 ? (
          pages.map((page) => <PageCard key={page.sys.id} page={page} />)
        ) : (
          <div className='py-5 px-2.5 bg-light-grey rounded-lg text-center lg:col-start-2'>
            {'No articles are online yet. Please come back later!'}
          </div>
        )}
      </div>
    </Container>
  );
}
