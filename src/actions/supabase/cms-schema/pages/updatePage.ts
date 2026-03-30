'use server';

import { revalidatePath } from 'next/cache';
import { pagesTable } from '@/actions/supabase/actions';
import { Page } from '@/types/supabase.types';
import { generatePageSlug } from '@/utils/supabase/generatePageSlug';

// =================================================
// Update page
// =================================================
export async function updatePage(id: string, data: Partial<Page>) {
  try {
    if (!id) return { success: false, error: 'ID is required' };
    if (!data.title?.trim())
      return { success: false, error: 'Title is required' };

    const page = await pagesTable();
    const slug = generatePageSlug(data.title);

    const updateData = {
      title: data.title?.trim() || '',
      slug,
      type: data.type || 'articles',
      bannerimage: data.bannerimage || null,
      sections: data.sections ?? [],
      author: data.author || null,
      ispublished: data.ispublished ?? true,
      updatedat: new Date().toISOString(),
    };

    const { data: u, error } = await page
      .update(updateData)
      .eq('id', id)
      .select('type')
      .single();

    if (error)
      return { success: false, error: error.message || 'Page not found' };

    revalidatePath(`/admin-panel/pages/${u.type}`);

    return { success: true };
  } catch (error) {
    console.error('Error updating page:', error);
    return { success: false, error: (error as Error).message };
  }
}
