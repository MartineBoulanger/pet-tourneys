'use server';

import { revalidatePath } from 'next/cache';
import { commentsTable } from '@/actions/supabase/actions';
// import { getUserSession } from '@/actions/supabase/api-schema/auth/getUserSession';

// =================================================
// Delete comment
// =================================================
export async function deleteComment(id: string, path: string) {
  try {
    if (!id) return { success: false, error: 'ID is required' };

    // const session = await getUserSession();
    // if (!session || !session.user) {
    //   return { success: false, error: 'Not authenticated' };
    // }

    const comm = await commentsTable();
    const { error } = await comm.delete().eq('id', id);

    if (error)
      return {
        success: false,
        error: error.message || 'Comment not found or user not authorized',
      };

    revalidatePath(path);

    return { success: true };
  } catch (error) {
    console.error('Error deleting comment:', error);
    return { success: false, error: (error as Error).message };
  }
}
