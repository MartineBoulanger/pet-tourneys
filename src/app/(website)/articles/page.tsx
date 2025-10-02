import { MdOutlineMenuBook } from 'react-icons/md';
import { Container, Heading, Paragraph } from '@/components/ui';
import { PagesList } from '@/features/cms/components/pages/PagesList';
import { getPagesByType } from '@/features/cms/actions/pages';

export async function generateMetadata() {
  return {
    title: 'Articles',
    description:
      'Articles about pet battling, and battle pets, and WoW pet news',
    alternates: {
      canonical: `${process.env.BASE_URL!}/articles`,
    },
  };
}

export default async function ArticlesPage() {
  const pages = await getPagesByType('articles');

  return (
    <Container className='lg:px-5'>
      <Heading className='text-center'>{'Articles'}</Heading>
      <Paragraph className='max-w-[700px] text-center mx-auto'>
        {
          'New expansion? Or new patch? And you want to know what new is coming for battle pets and pet battling? Check out our news articles, and articles about new pets, new strategies, etc.'
        }
      </Paragraph>
      {pages && pages.length > 0 ? (
        <PagesList pages={pages} />
      ) : (
        <div className='bg-light-grey rounded-lg mt-5 lg:mt-10 p-2.5 lg:p-5'>
          <div className='flex flex-col items-center justify-center text-center px-2.5 lg:px-5 py-20 bg-background rounded-lg'>
            <MdOutlineMenuBook className='text-humanoid mb-6 w-24 h-24' />
            <Heading as='h2' className='mb-5 text-foreground/80'>
              {`No articles pages available`}
            </Heading>
            <Paragraph className='text-foreground/50'>
              {`There are no articles pages available at this moment, please come back later.`}
            </Paragraph>
          </div>
        </div>
      )}
    </Container>
  );
}
