'use server';

import { revalidatePath } from 'next/cache';
import { pagesTable } from '@/actions/supabase/actions';
import { Page } from '@/types/supabase.types';
import { generatePageSlug } from '@/utils/supabase/generatePageSlug';

// =================================================
// Create page
// =================================================
export async function createPage(data: Partial<Page>) {
  try {
    if (!data.title?.trim())
      return { success: false, error: 'Title is required' };

    const page = await pagesTable();
    const slug = generatePageSlug(data.title);

    const pageData = {
      title: data.title?.trim() || '',
      slug,
      type: data.type || 'articles',
      bannerimage: data.bannerimage || null,
      sections: data.sections ?? [],
      author: data.author || null,
      ispublished: data.ispublished ?? false,
      createdat: new Date().toISOString(),
      updatedat: new Date().toISOString(),
    };

    const { data: result, error } = await page
      .insert(pageData)
      .select('*')
      .single();

    if (error)
      return { success: false, error: error.message || 'Page not created' };

    revalidatePath(`/admin-panel/pages/${result.type}`);

    return {
      success: true,
      resource: {
        id: result.id || '',
        title: result.title || pageData.title || '',
        slug: result.slug || pageData.slug || '',
        type: result.type || pageData.type || 'articles',
        bannerimage: result.bannerimage || pageData.bannerimage || null,
        sections: result.sections || pageData.sections || [],
        author: result.author || pageData.author || null,
        ispublished: result.ispublished ?? pageData.ispublished ?? false,
        createdat: new Date(
          result.createdat || pageData.createdat,
        ).toISOString(),
        updatedat: new Date(
          result.updatedat || pageData.updatedat,
        ).toISOString(),
      },
    };
  } catch (error) {
    console.error('Error creating page:', error);
    return { success: false, error: (error as Error).message };
  }
}
