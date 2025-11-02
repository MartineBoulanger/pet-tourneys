import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/features/cms/actions/pages';
import { PageDetails } from '@/features/cms/components/pages/PageDetails';
import { CommentsSection } from '@/features/cms/components/comments/CommentsSection';
import { getUserSession } from '@/features/supabase/actions/auth';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pageData = await getPageBySlug(slug);

  if (!pageData.success) {
    return {
      title: 'Pet Review',
      description: 'Pet Review for getting to know what pets are good, or bad',
      alternates: {
        canonical: `${process.env.BASE_URL!}/pet-reviews/${slug}`,
      },
    };
  }

  const page = pageData.page || null;

  return {
    title: page?.title || 'Pet Review',
    description: 'Pet Review for getting to know what pets are good, or bad',
    keywords: ['WoW, PML, reviews, pet, pet battle, PvP'],
    alternates: {
      canonical: `${process.env.BASE_URL!}/pet-reviews/${slug}`,
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
  const session = await getUserSession();

  if (!pageData) notFound();
  if (!pageData.success) return null;

  const page = pageData.page || null;

  return (
    <>
      <PageDetails page={page} type='pet-reviews' />
      <CommentsSection
        pageId={page?._id!}
        username={session?.user?.username}
        isAdmin={session?.user?.role === 'admin'}
        path={`/pet-reviews/${slug}`}
      />
    </>
  );
}
