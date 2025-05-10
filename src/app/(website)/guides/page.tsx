import { notFound } from 'next/navigation';
import { Container, Heading, Paragraph } from '@/components/ui';
import { PageCard } from '@/components/contentful/PageCard';
import { getAllPages } from '@/contentful/actions/getAllPages';
import { AllPagesFragment } from '@/types';

export async function generateMetadata() {
  return {
    title: 'Our Guides',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL!}/guides`,
    },
  };
}

export default async function GuidesPage() {
  const pages: AllPagesFragment[] = await getAllPages(false, 'Guide');

  if (!pages) notFound();
  // TODO: add pagination with 12 page cards  per page -> see commercial LLBG for implementing pagination for Contentful
  return (
    <Container>
      <Heading className='text-center'>{'Our Guides'}</Heading>
      <Paragraph className='max-w-[700px] text-center mx-auto'>
        {
          'If you are looking for some guides about pet battling, or you need to remind yourself how to report a win-ticket in Discord, our guides will help you with all your questions and help you to achieve what you are looking for.'
        }
      </Paragraph>
      {/* Page cards list */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-10 sm:mt-20 gap-5'>
        {pages && pages.length > 0 ? (
          pages.map((page) => <PageCard key={page.sys.id} page={page} />)
        ) : (
          <div className='py-5 px-2.5 bg-light-grey rounded-lg text-center lg:col-start-2'>
            {'No guides are online yet. Please come back later!'}
          </div>
        )}
      </div>
    </Container>
  );
}
