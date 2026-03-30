'use server';

import { pagesTable } from '@/actions/supabase/actions';
import { Page } from '@/types/supabase.types';

// =================================================
// Get pages based on page type
// =================================================
export async function getPages(type: Page['type']): Promise<{
  success: boolean;
  data?: Page[];
  error?: string;
}> {
  try {
    const page = await pagesTable();

    const { data, error } = await page
      .select('*')
      .eq('type', type)
      .order('createdat', { ascending: false });

    if (error)
      return { success: false, error: error.message || 'Pages not found' };

    const processedPages = data?.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      type: p.type,
      bannerimage: p.bannerimage as Page['bannerimage'],
      sections: p.sections as Page['sections'],
      ispublished: p.ispublished,
      author: p.author,
      createdat: new Date(p.createdat || '').toLocaleString(),
      updatedat: new Date(p.updatedat || '').toLocaleString(),
    }));

    return { success: true, data: processedPages || [] };
  } catch (error) {
    console.error('Error fetching pages:', error);
    return { success: false, error: (error as Error).message };
  }
}

// =================================================
// Get recent pages for on the homepage
// =================================================
export async function getRecentPages(types: Page['type'][]): Promise<{
  success: boolean;
  result?: {
    type: Page['type'];
    data: Page[] | undefined;
  }[];
  error?: string;
}> {
  try {
    if (!types || types.length === 0)
      return { success: false, error: 'Page types are required' };

    const result = await Promise.all(
      types.map(async (type) => {
        const { data: pages } = await getPages(type);
        return { type, data: pages?.slice(0, 5) };
      }),
    );

    return { success: true, result: result };
  } catch (error) {
    console.error('Error fetching recent pages:', error);
    return { success: false, error: (error as Error).message };
  }
}

// =================================================
// Get a page based on page slug
// =================================================
export async function getPage(slug: string) {
  try {
    if (!slug) return { success: false, error: 'Slug is required' };

    const page = await pagesTable();

    const { data, error } = await page
      .select('*')
      .eq('slug', slug)
      .limit(1)
      .single();

    if (error)
      return { success: false, error: error.message || 'Page not found' };

    const processedPage = {
      id: data.id,
      title: data.title,
      slug: data.slug,
      type: data.type,
      bannerimage: data.bannerimage as Page['bannerimage'],
      sections: data.sections as Page['sections'],
      author: data.author,
      ispublished: data.ispublished,
      createdat: new Date(data.createdat || '').toLocaleString(),
      updatedat: new Date(data.updatedat || '').toLocaleString(),
    };

    return { success: true, data: processedPage || null };
  } catch (error) {
    console.error('Error fetching page:', error);
    return { success: false, error: (error as Error).message };
  }
}
