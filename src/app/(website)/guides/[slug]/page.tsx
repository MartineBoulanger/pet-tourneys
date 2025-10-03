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
      title: 'Guide',
      description:
        'Guide for pet masters about pet battling, battle pets, and the pet masters league',
      alternates: {
        canonical: `${process.env.BASE_URL!}/guides/${slug}`,
      },
    };
  }

  const page = pageData.page || null;

  return {
    title: page?.title || 'Guide',
    description:
      'Guide for pet masters about pet battling, battle pets, and the pet masters league',
    keywords: ['WoW, PML, guides, pet, pet battle, PvP'],
    alternates: {
      canonical: `${process.env.BASE_URL!}/guides/${slug}`,
    },
    openGraph: {
      images: page?.bannerImage?.secure_url
        ? [page?.bannerImage?.secure_url]
        : ['/opengraph-image.png'],
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pageData = await getPageBySlug(slug);

  if (!pageData) notFound();
  if (!pageData.success) return null;

  const page = pageData.page || null;

  return <PageDetails page={page} type='guides' />;
}
