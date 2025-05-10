import { notFound } from 'next/navigation';
import { TbSquareChevronsDown } from 'react-icons/tb';
import { getPage } from '@/contentful/actions/getPage';
import { Container, PageHeading, ActionDropdownItem } from '@/components/ui';
import RichText from '@/components/contentful/RichText';
import PageContent from '@/components/contentful/PageContent';
import Banner from '@/components/contentful/Banner';
import { ContentTypeCta, ContentTypePage } from '@/types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPage(false, slug);
  const seoData = page && page.seoMetadata;

  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
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

  return (
    <div className='flex flex-col'>
      {page.banner ? (
        <>
          <Banner component={page.banner} isPage />
          <div className='hidden md:block md:w-[40px] md:mx-auto text-light-blue animate-bounce mb-10'>
            <TbSquareChevronsDown className='w-10 h-10' />
          </div>
        </>
      ) : null}
      <Container className='p-2.5 sm:p-5 bg-light-grey rounded-lg shadow-md'>
        <div className='p-5 rounded-lg bg-background mb-5'>
          <PageHeading heading={page.pageTitle} className='md:items-start'>
            <div className='flex flex-col gap-2.5'>
              {page.ctAsCollection && page.ctAsCollection.items
                ? page.ctAsCollection.items.map(
                    (link: ContentTypeCta | null, index: number) => (
                      <ActionDropdownItem
                        key={index}
                        url={link?.ctaUrl || ''}
                        text={link?.ctaText || ''}
                      />
                    )
                  )
                : null}
            </div>
          </PageHeading>
          {page.pageDescription ? (
            <RichText component={page.pageDescription} />
          ) : null}
        </div>
        {/* <div className='h-0.5 rounded-lg w-full bg-medium-grey my-10' /> */}
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
