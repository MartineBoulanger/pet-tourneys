'use server';

import { revalidatePath } from 'next/cache';
import { resourcesTable } from '@/actions/supabase/actions';
import { Resource } from '@/types/supabase.types';

// =================================================
// Update resource
// =================================================
export async function updateResource(id: string, data: Partial<Resource>) {
  try {
    if (!id) return { success: false, error: 'ID is required' };

    if (!data.title?.trim())
      return { success: false, error: 'Title is required' };

    // validate that we have at least 1 image
    if (!data.images || data.images.length === 0)
      return {
        success: false,
        error: 'At least one image is required',
      };

    const cms = await resourcesTable();

    const updateData = {
      title: data.title.trim(),
      images: data.images,
      index: data.index ?? 1,
      updatedat: new Date().toISOString(),
    };

    const { error } = await cms.update(updateData).eq('id', id);

    if (error)
      return { success: false, error: error.message || 'Resource not found' };

    revalidatePath('/admin-panel/content/resources');

    return { success: true };
  } catch (error) {
    console.error('Error updating resource:', error);
    return { success: false, error: (error as Error).message };
  }
}

// =================================================
// Reorder resources
// =================================================
export async function reorderResources(ids: string[]) {
  try {
    if (!ids || ids.length === 0)
      return { success: false, error: 'IDs are required' };

    const cms = await resourcesTable();

    const updates = ids.map((id, index) =>
      cms
        .update({ index: index + 1, updatedat: new Date().toISOString() })
        .eq('id', id),
    );

    const results = await Promise.all(updates);
    const failed = results.find((r) => r.error);

    if (failed?.error) return { success: false, error: failed.error.message };

    revalidatePath('/admin-panel/content/resources');

    return { success: true };
  } catch (error) {
    console.error('Error reordering resources:', error);
    return { success: false, error: (error as Error).message };
  }
}
