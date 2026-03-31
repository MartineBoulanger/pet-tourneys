'use server';

import { revalidatePath } from 'next/cache';
import { commentsTable } from '@/actions/supabase/actions';
import { Comment } from '@/types/supabase.types';

// =================================================
// Update comment
// =================================================
export async function updateComment(
  id: string,
  data: Partial<Comment>,
  path: string,
) {
  try {
    if (!id) return { success: false, error: 'ID is required' };
    if (!data.content) return { success: false, error: 'Content is required' };

    const updateData = {
      content: data.content.trim(),
      updatedat: new Date().toISOString(),
    };

    const comm = await commentsTable();
    const { error } = await comm.update(updateData).eq('id', id);

    if (error)
      return { success: false, error: error.message || 'Comment not found' };

    revalidatePath(path);

    return { success: true };
  } catch (error) {
    console.error('Error updating comment:', error);
    return { success: false, error: (error as Error).message };
  }
}
