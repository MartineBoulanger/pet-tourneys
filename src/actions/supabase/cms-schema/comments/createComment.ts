'use server';

import { revalidatePath } from 'next/cache';
import { commentsTable } from '@/actions/supabase/actions';
import { Comment } from '@/types/supabase.types';
// import { getUserSession } from '@/actions/supabase/api-schema/auth/getUserSession';

// =================================================
// Create comment
// =================================================
export async function createComment(data: Partial<Comment>, path: string) {
  try {
    if (!data.pageid) return { success: false, error: 'Invalid page ID' };
    if (!data.content?.trim())
      return { success: false, error: 'Content is required' };

    // const session = await getUserSession();
    // if (!session || !session.user) {
    //   return { success: false, error: 'You must be logged in to comment' };
    // }
    // const profile = session && session.user;

    const commentData = {
      pageid: data.pageid,
      name: data.name?.trim() || 'Anonymous',
      username: data.username?.trim() || '',
      content: data.content.trim(),
      user_id: data.user_id || null,
      createdat: new Date().toISOString(),
      updatedat: new Date().toISOString(),
    };

    const comm = await commentsTable();
    const { error } = await comm.insert(commentData);

    if (error)
      return { success: false, error: error.message || 'Comment not found' };

    revalidatePath(path);

    return { success: true };
  } catch (error) {
    console.error('Error creating comment:', error);
    return { success: false, error: (error as Error).message };
  }
}
