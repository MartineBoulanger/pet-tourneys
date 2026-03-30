'use server';

import { revalidatePath } from 'next/cache';
import { prizesTable } from '@/actions/supabase/actions';
import { Prize } from '@/types/supabase.types';

// =================================================
// Update prize
// =================================================
export async function updatePrize(id: string, data: Partial<Prize>) {
  try {
    if (!id) return { success: false, error: 'ID is required' };

    if (!data.title?.trim() || !data.description?.trim())
      return { success: false, error: 'Title and Description are required' };

    const prize = await prizesTable();

    const prizeData = {
      title: data.title.trim(),
      description: data.description.trim(),
      iscarousel: data.iscarousel,
      iscolumnlayout: data.iscolumnlayout,
      imageposition: data.imageposition,
      textalignment: data.textalignment,
      images: data.images,
      videourl: data.videourl,
      index: data.index ?? 1,
      updatedat: new Date().toISOString(),
    };

    const { error } = await prize.update(prizeData).eq('id', id);

    if (error)
      return { success: false, error: error.message || 'Prize not found' };

    revalidatePath('/admin-panel/leagues/prizes');

    return { success: true };
  } catch (error) {
    console.error('Error updating prize:', error);
    return { success: false, error: (error as Error).message };
  }
}

// =================================================
// Reorder prizes
// =================================================
export async function reorderPrizes(ids: string[]) {
  try {
    if (!ids || ids.length === 0)
      return { success: false, error: 'IDs are required' };

    const prize = await prizesTable();

    const updates = ids.map((id, index) =>
      prize
        .update({ index: index + 1, updatedat: new Date().toISOString() })
        .eq('id', id),
    );

    const results = await Promise.all(updates);
    const failed = results.find((r) => r.error);

    if (failed?.error) return { success: false, error: failed.error.message };

    revalidatePath('/admin-panel/leagues/prizes');

    return { success: true };
  } catch (error) {
    console.error('Error reordering prizes:', error);
    return { success: false, error: (error as Error).message };
  }
}
