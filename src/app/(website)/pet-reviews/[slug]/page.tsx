import { notFound } from 'next/navigation';
import { TbSquareChevronsDown } from 'react-icons/tb';
import { getPage } from '@/contentful/actions/getPage';
import { Container, Heading, PageMenu } from '@/components/ui';
import RichText from '@/components/contentful/RichText';
import PageContent from '@/components/contentful/PageContent';
import Banner from '@/components/contentful/Banner';
import { ContentTypePage } from '@/components/contentful/types';
import { Links } from '@/lib/types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPage(false, slug);

  if (!page?.seoMetadata) {
    return {
      title: 'Pet Reviews',
      description:
        'Pet Reviews for getting the best battle pet for your PvP team',
      alternates: {
        canonical: `${process.env.BASE_URL!}/pet-reviews/${slug}`,
      },
    };
  }

  const { title, description, indexable, keywords, image } = page.seoMetadata;

  return {
    title: title || 'Pet Reviews',
    description:
      description ||
      'Pet Reviews for getting the best battle pet for your PvP team',
    keywords: keywords || ['WoW, reviews, pet'],
    alternates: {
      canonical: `${process.env.BASE_URL!}/pet-reviews/${slug}`,
    },
    robots: {
      index: indexable === true,
      follow: indexable === true,
    },
    openGraph: {
      images: image?.url ? [image.url] : ['/opengraph-image.png'],
    },
  };
}

export default async function GuidePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === 'true' ? true : false;
  const page: ContentTypePage = await getPage(isPreview, slug);

  if (!page) notFound();

  const links: Links = [];
  if (page.ctAsCollection?.items) {
    links.push(
      ...page.ctAsCollection.items.map((link, index) => ({
        id: index,
        url: link?.ctaUrl || '',
        text: link?.ctaText || '',
      }))
    );
  }

  return (
    <div className='flex flex-col px-5'>
      {links ? (
        <Container className='w-full'>
          <PageMenu links={links} className='mt-5' />
        </Container>
      ) : null}
      {page.banner ? (
        <>
          <Banner component={page.banner} isPage />
          <div className='hidden lg:block lg:w-[40px] lg:mx-auto text-foreground animate-bounce mb-10'>
            <TbSquareChevronsDown className='w-10 h-10' />
          </div>
        </>
      ) : null}
      <Container className='p-2.5 bg-light-grey rounded-lg shadow-md'>
        {page.pageTitle || page.pageDescription ? (
          <div className='p-2.5 rounded-t-lg bg-background'>
            {page.pageTitle ? (
              <Heading className='text-center'>{page.pageTitle}</Heading>
            ) : null}
            {page.pageDescription ? (
              <>
                <RichText
                  component={page.pageDescription}
                  className='lg:w-full'
                />
                <div className='h-0.5 w-full bg-light-grey rounded-lg mt-2.5 lg:mt-5' />
              </>
            ) : null}
          </div>
        ) : null}
        {page.pageContentCollection?.items ? (
          <PageContent components={page.pageContentCollection.items} />
        ) : null}
      </Container>
    </div>
  );
}
