import { MdOutlineMenuBook } from 'react-icons/md';
import { Container, Heading, Paragraph } from '@/components/ui';
import { PagesList } from '@/features/cms/components/pages/PagesList';
import { getPagesByType } from '@/features/cms/actions/pages';

export async function generateMetadata() {
  return {
    title: 'Guides',
    description:
      'Guides for pet masters about pet battling, battle pets, and the pet masters league',
    alternates: {
      canonical: `${process.env.BASE_URL!}/guides`,
    },
  };
}

export default async function GuidesPage() {
  const pages = await getPagesByType('guides');

  return (
    <Container className='lg:px-5'>
      <Heading className='text-center'>{'Guides'}</Heading>
      <Paragraph className='max-w-[700px] text-center mx-auto'>
        {
          'Looking for some guides about pet battling, or battle pets? Or you need to remind yourself how to report a win-ticket in Discord? You can find any guide you need about pet battling and the league here.'
        }
      </Paragraph>
      {pages && pages.length > 0 ? (
        <PagesList pages={pages} type='guides' />
      ) : (
        <div className='bg-light-grey rounded-lg mt-5 lg:mt-10 p-2.5 lg:p-5'>
          <div className='flex flex-col items-center justify-center text-center px-2.5 lg:px-5 py-20 bg-background rounded-lg'>
            <MdOutlineMenuBook className='text-humanoid mb-6 w-24 h-24' />
            <Heading as='h2' className='mb-5 text-foreground/80'>
              {`No guides pages available`}
            </Heading>
            <Paragraph className='text-foreground/50'>
              {`There are no guides pages available at this moment, please come back later.`}
            </Paragraph>
          </div>
        </div>
      )}
    </Container>
  );
}
