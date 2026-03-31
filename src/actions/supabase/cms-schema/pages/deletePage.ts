'use server';

import { revalidatePath } from 'next/cache';
import { pagesTable } from '@/actions/supabase/actions';

// =================================================
// Delete page
// =================================================
export async function deletePage(id: string, path: string) {
  try {
    if (!id) return { success: false, error: 'ID is required' };

    const page = await pagesTable();

    const { error } = await page.delete().eq('id', id);

    if (error)
      return { success: false, error: error.message || 'Page not found' };

    revalidatePath(path);

    return { success: true };
  } catch (error) {
    console.error('Error deleting page:', error);
    return { success: false, error: (error as Error).message };
  }
}
