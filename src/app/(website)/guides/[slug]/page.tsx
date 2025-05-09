import { notFound } from 'next/navigation';
import { getPage } from '@/contentful/actions/getPage';
import { Container, PageHeading, ActionDropdownItem } from '@/components/ui';
import Link from 'next/link';
import { Fragment } from 'react';

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
  const page = await getPage(isPreview, slug);

  if (!page) notFound();

  console.log('page data', page);

  return (
    <Container>
      <PageHeading heading={page.pageTitle}>
        <div className='flex flex-col gap-2.5'>
          {page.ctAsCollection?.items.map((link: any, index: number) => (
            <ActionDropdownItem
              key={index}
              url={link.ctaUrl}
              text={link.ctaText}
            />
          ))}
        </div>
      </PageHeading>
    </Container>
  );
}
