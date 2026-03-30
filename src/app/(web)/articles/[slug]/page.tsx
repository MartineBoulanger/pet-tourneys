import { notFound } from 'next/navigation';
import { getPage } from '@/actions/supabase/cms-schema/pages/getPages';
import { PageDetails } from '@/components/cms/pages/PageDetails';
import { CommentsSection } from '@/components/cms/comments/CommentsSection';
import { getUserSession } from '@/actions/supabase/api-schema/auth/getUserSession';
import { toastError } from '@/utils/toast';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { success, data, error } = await getPage(slug);

  if (!success) {
    return {
      title: 'Article',
      description:
        'Article about pet battling, and battle pets, and WoW pet news',
      alternates: {
        canonical: `${process.env.BASE_URL!}/articles/${slug}`,
      },
    };
  }

  if (error) toastError(error);

  const page = data || null;

  return {
    title: page?.title || 'Article',
    description:
      'Article about pet battling, and battle pets, and WoW pet news',
    keywords: ['WoW, PML, articles, pet, pet battle, PvP'],
    alternates: {
      canonical: `${process.env.BASE_URL!}/articles/${slug}`,
    },
    openGraph: {
      images: page?.bannerimage?.secure_url
        ? [page?.bannerimage?.secure_url]
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
  const { success, data, error } = await getPage(slug);
  const session = await getUserSession();

  if (!success && error) {
    toastError(error);
    return null;
  }
  if (!data) notFound();

  const username = session && session.user ? session.user.username : '';
  const isAdmin =
    session && session.user ? session.user.role === 'admin' : false;
  const userId = session && session.user ? session.user.id : null;

  return (
    <>
      <PageDetails page={data} type='articles' />
      <CommentsSection
        pageid={data.id}
        username={username}
        isLoggedIn={!!session}
        isAdmin={isAdmin}
        userId={userId}
        path={`/articles/${slug}`}
      />
    </>
  );
}
