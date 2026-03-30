'use server';

import { revalidatePath } from 'next/cache';
import { resourcesTable } from '@/actions/supabase/actions';

// =================================================
// Delete resource
// =================================================
export async function deleteResource(id: string) {
  try {
    if (!id) return { success: false, error: 'ID is required' };

    const cms = await resourcesTable();
    const { error } = await cms.delete().eq('id', id);
    if (error)
      return { success: false, error: error.message || 'Resource not found' };

    revalidatePath('/admin-panel/content/resources');

    return { success: true };
  } catch (error) {
    console.error('Error updating resource:', error);
    return { success: false, error: (error as Error).message };
  }
}
