import { TbSquareChevronsDown } from 'react-icons/tb';
import { Container, Heading, PageMenu } from '@/components/ui';
import { PageSection } from '@/features/cms/components/pages/PageSection';
import { Banner } from '@/features/cms/components/Banner';
import { Page } from '@/features/cms/types';
import { Links } from '@/lib/types';

export function PageDetails({
  page,
  type,
}: {
  page: Page | null;
  type: string;
}) {
  if (!page) return null;

  let listLink: string;
  let linkText: string;

  switch (type) {
    case 'articles':
      listLink = '/articles';
      linkText = 'Articles List';
      break;
    case 'guides':
      listLink = '/guides';
      linkText = 'Guides List';
      break;
    case 'pet-reviews':
      listLink = '/pet-reviews';
      linkText = 'Pet Reviews List';
      break;
    default:
      listLink = '';
      linkText = '';
  }

  const links: Links = [
    {
      id: 1,
      url: listLink,
      text: linkText,
    },
    {
      id: 2,
      url: '/',
      text: 'Home',
    },
  ];

  return (
    <div className='flex flex-col px-5'>
      {links ? (
        <Container className='w-full'>
          <PageMenu links={links} />
        </Container>
      ) : null}
      {page?.bannerType !== 'none' ? (
        <>
          <Banner
            bannerType={page?.bannerType || 'none'}
            bannerImage={page?.bannerImage}
            bannerUrl={page?.bannerUrl}
            title={page?.title || ''}
          />
          <div className='hidden lg:block lg:w-[40px] lg:mx-auto text-foreground animate-bounce mb-10'>
            <TbSquareChevronsDown className='w-10 h-10' />
          </div>
        </>
      ) : null}
      {page?.title ? (
        <Heading className='mb-0 mt-5 lg:mt-0'>{page.title}</Heading>
      ) : null}
      <Container className='p-2.5 lg:p-5 pb-0 lg:pb-2.5 bg-light-grey rounded-lg shadow-md'>
        {page?.sections && page?.sections?.length > 0
          ? page.sections.map((section, index) => (
              <PageSection key={index} section={section} />
            ))
          : null}
      </Container>
    </div>
  );
}
