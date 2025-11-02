import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/features/cms/actions/pages';
import { PageDetails } from '@/features/cms/components/pages/PageDetails';
import { CommentsSection } from '@/features/cms/components/comments/CommentsSection';
import {
  // getAdminSession,
  getUserSession,
} from '@/features/supabase/actions/auth';

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
  const session = await getUserSession();

  if (!pageData) notFound();
  if (!pageData.success || !pageData.page) return null;

  const page = pageData.page;
  const username = session && session.user ? session.user.username : '';
  const isAdmin =
    session && session.user ? session.user.role === 'admin' : false;

  return (
    <>
      <PageDetails page={page} type='articles' />
      <CommentsSection
        pageId={page._id}
        username={username}
        isAdmin={isAdmin}
        path={`/articles/${slug}`}
      />
    </>
  );
}
