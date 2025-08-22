import { notFound } from 'next/navigation';
import { Container, Heading, Paragraph } from '@/components/ui';
import { PageCard } from '@/components/contentful/PageCard';
import { getAllPages } from '@/contentful/actions/getAllPages';
import { AllPagesFragment } from '@/components/contentful/types';

export async function generateMetadata() {
  return {
    title: 'Our Articles',
    alternates: {
      canonical: `${process.env.BASE_URL!}/articles`,
    },
  };
}

export default async function ArticlesPage() {
  const pages: AllPagesFragment[] = await getAllPages(false, 'Article');

  if (!pages) notFound();
  // TODO: add pagination with 12 page cards  per page -> see commercial LLBG for implementing pagination for Contentful
  return (
    <Container className='lg:px-5'>
      <Heading className='text-center'>{'Our Pet Battle Articles'}</Heading>
      <Paragraph className='max-w-[700px] text-center mx-auto'>
        {
          'New expansion? Or new patch? And you want to know what new is coming for battle pets and pet battling? Check out our news articles, and articles about new pets, new strategies, etc.'
        }
      </Paragraph>
      {/* Page cards list */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-10 lg:mt-20 gap-2.5 sm:gap-5'>
        {pages && pages.length > 0 ? (
          pages.map((page) => <PageCard key={page.sys.id} page={page} />)
        ) : (
          <div className='col-span-full p-2.5 lg:p-5 bg-background rounded-lg text-center col-start-1'>
            {'No articles are online yet. Please come back later!'}
          </div>
        )}
      </div>
    </Container>
  );
}
