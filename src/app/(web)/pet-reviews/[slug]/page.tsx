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
      title: 'Pet Review',
      description: 'Pet Review',
      alternates: {
        canonical: `${process.env.BASE_URL!}/pet-reviews/${slug}`,
      },
    };
  }

  if (error) toastError(error);

  const page = data || null;

  return {
    title: page?.title || 'Pet Review',
    description: 'Pet Review',
    keywords: ['WoW, PML, pet reviews, pet, pet battle, PvP'],
    alternates: {
      canonical: `${process.env.BASE_URL!}/pet-reviews/${slug}`,
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

  return (
    <>
      <PageDetails page={data} type='pet-reviews' />
      <CommentsSection
        pageid={data.id}
        username={username}
        isAdmin={isAdmin}
        path={`/pet-reviews/${slug}`}
      />
    </>
  );
}
