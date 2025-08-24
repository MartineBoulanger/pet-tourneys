import { notFound } from 'next/navigation';
import { Container, Heading, Paragraph } from '@/components/ui';
import { PageCard } from '@/components/contentful/PageCard';
import { getAllPages } from '@/contentful/actions/getAllPages';
import { AllPagesFragment } from '@/components/contentful/types';

export async function generateMetadata() {
  return {
    title: 'Our Guides',
    alternates: {
      canonical: `${process.env.BASE_URL!}/guides`,
    },
  };
}

export default async function GuidesPage() {
  const pages: AllPagesFragment[] = await getAllPages(false, 'Guide');

  if (!pages) notFound();
  // TODO: add pagination with 12 page cards  per page -> see commercial LLBG for implementing pagination for Contentful
  return (
    <Container className='lg:px-5'>
      <Heading className='text-center'>{'Guides'}</Heading>
      <Paragraph className='max-w-[700px] text-center mx-auto'>
        {
          'Looking for some guides about pet battling, or battle pets? Or you need to remind yourself how to report a win-ticket in Discord? You can find any guide you need about pet battling and the league here.'
        }
      </Paragraph>
      {/* Page cards list */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-10 lg:mt-20 gap-2.5 sm:gap-5'>
        {pages && pages.length > 0 ? (
          pages.map((page) => <PageCard key={page.sys.id} page={page} />)
        ) : (
          <div className='col-span-full p-2.5 lg:p-5 bg-background rounded-lg text-center col-start-1'>
            {'No guides are online yet. Please come back later!'}
          </div>
        )}
      </div>
    </Container>
  );
}
