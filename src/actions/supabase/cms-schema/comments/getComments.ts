'use server';

import { commentsTable } from '@/actions/supabase/actions';
import { Comment } from '@/types/supabase.types';

// =================================================
// Get comments - comments are always per page
// =================================================
export async function getComments(
  pageid: string,
): Promise<{ success: boolean; data?: Comment[]; error?: string }> {
  try {
    if (!pageid) return { success: false, error: 'page ID is required' };

    const comm = await commentsTable();

    const { data, error } = await comm
      .select('*')
      .eq('pageid', pageid)
      .order('createdat', { ascending: false });

    if (error)
      return { success: false, error: error.message || 'Comments not found' };

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching comments:', error);
    return { success: false, error: (error as Error).message };
  }
}
