import { notFound } from 'next/navigation';
import { TbSquareChevronsDown } from 'react-icons/tb';
import { getPage } from '@/contentful/actions/getPage';
import { Container, PageHeading, PageMenu } from '@/components/ui';
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
  const seoData = page && page.seoMetadata;

  return {
    title: seoData.title || 'Our Guides',
    description:
      seoData.description || 'Our Guides for all that want to know things.',
    keywords: seoData.keywords || ['WoW, guides, pet'],
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL!}/guides/${slug}`,
    },
    robots: {
      index: seoData.indexable === true || false,
      follow: seoData.indexable === true || false,
    },
    openGraph: {
      images: seoData.image.media.url || '/opengraph-image.png',
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

  // make links data for the dropdown menu on the page
  const links: Links =
    page.ctAsCollection && page.ctAsCollection.items.length > 0
      ? page.ctAsCollection.items.map((link, index) => ({
          id: index,
          url: link?.ctaUrl || '',
          text: link?.ctaText || '',
        }))
      : [];

  return (
    <div className='flex flex-col px-5'>
      {page.banner ? (
        <>
          <Banner component={page.banner} isPage />
          <div className='hidden lg:block lg:w-[40px] lg:mx-auto text-humanoid animate-bounce mb-10'>
            <TbSquareChevronsDown className='w-10 h-10' />
          </div>
        </>
      ) : null}
      <Container className='p-2.5 lg:p-5 bg-light-grey rounded-lg shadow-md'>
        {page.pageTitle || page.pageDescription ? (
          <div className='p-2.5 lg:p-5 rounded-lg bg-background mb-5'>
            {page.pageTitle ? (
              <PageHeading heading={page.pageTitle} className='md:items-start'>
                <PageMenu links={links} />
              </PageHeading>
            ) : null}
            {page.pageDescription ? (
              <RichText component={page.pageDescription} />
            ) : null}
          </div>
        ) : null}
        <div>
          {page.pageContentCollection &&
          page.pageContentCollection.items.length > 0 ? (
            <PageContent components={page.pageContentCollection.items} />
          ) : null}
        </div>
      </Container>
    </div>
  );
}
