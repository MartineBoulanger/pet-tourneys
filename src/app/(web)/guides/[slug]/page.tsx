import { notFound } from 'next/navigation';
import { getPage } from '@/actions/supabase/cms-schema/pages/getPages';
import { PageDetails } from '@/components/cms/pages/PageDetails';
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
      title: 'Guide',
      description: 'Guide about PML systems, and pet battling',
      alternates: {
        canonical: `${process.env.BASE_URL!}/guides/${slug}`,
      },
    };
  }

  if (error) toastError(error);

  const page = data || null;

  return {
    title: page?.title || 'Guide',
    description: 'Guide about PML systems, and pet battling',
    keywords: ['WoW, PML, guides, pet, pet battle, PvP'],
    alternates: {
      canonical: `${process.env.BASE_URL!}/guides/${slug}`,
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

  if (!success && error) {
    toastError(error);
    return null;
  }
  if (!data) notFound();

  return <PageDetails page={data} type='guides' />;
}
