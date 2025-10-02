import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/features/cms/actions/pages';
import { PageDetails } from '@/features/cms/components/pages/PageDetails';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pageData = await getPageBySlug(slug);

  if (!pageData.success) {
    return {
      title: 'Article',
      description:
        'Article about pet battling, and battle pets, and WoW pet news',
      alternates: {
        canonical: `${process.env.BASE_URL!}/articles/${slug}`,
      },
    };
  }

  const page = pageData.page || null;

  return {
    title: page?.title || 'Article',
    description:
      'Article about pet battling, and battle pets, and WoW pet news',
    keywords: ['WoW, PML, articles, pet, pet battle, PvP'],
    alternates: {
      canonical: `${process.env.BASE_URL!}/articles/${slug}`,
    },
    openGraph: {
      images: page?.bannerImage?.secure_url
        ? [page?.bannerImage?.secure_url]
        : ['/opengraph-image.png'],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pageData = await getPageBySlug(slug);

  if (!pageData) notFound();
  if (!pageData.success) return null;

  const page = pageData.page || null;

  return <PageDetails page={page} type='articles' />;
}
