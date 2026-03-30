'use server';

import { revalidatePath } from 'next/cache';
import { announcementsTable } from '@/actions/supabase/actions';

// =================================================
// Delete announcement
// =================================================
export async function deleteAnnouncement(id: string) {
  try {
    if (!id) return { success: false, error: 'ID is required' };

    const cms = await announcementsTable();
    const { error } = await cms.delete().eq('id', id);

    if (error)
      return {
        success: false,
        error: error.message || 'Announcement not found',
      };

    revalidatePath('/admin-panel/announcements');

    return { success: true };
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return { success: false, error: (error as Error).message };
  }
}
