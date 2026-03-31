'use server';

import { revalidatePath } from 'next/cache';
import { announcementsTable } from '@/actions/supabase/actions';

// =================================================
// Set announcement visibility
// =================================================
export async function setVisibleAnnouncement(id: string) {
  try {
    if (!id) return { success: false, error: 'ID is required' };

    const cms = await announcementsTable();

    const { error } = await cms.select('*').eq('id', id).single();

    if (error)
      return {
        success: false,
        error: error.message || 'Announcement not found',
      };

    // Hide all other announcements
    const { error: hideError } = await cms
      .update({ isvisible: false })
      .in('isvisible', [true, false]);

    if (hideError)
      return {
        success: false,
        error: hideError.message || 'Failed to hide announcements',
      };

    // Set the specified announcement as visible
    const { error: showError } = await cms
      .update({ isvisible: true })
      .eq('id', id);

    if (showError)
      return {
        success: false,
        error: showError.message || 'Failed to set visible announcement',
      };

    revalidatePath('/admin-panel/announcements');

    return { success: true };
  } catch (error) {
    console.error('Error to set visible announcement:', error);
    return { success: false, error: (error as Error).message };
  }
}

// =================================================
// Hide announcement
// =================================================
export async function hideAnnouncement(id: string) {
  try {
    if (!id) return { success: false, error: 'ID is required' };

    const cms = await announcementsTable();
    const { error } = await cms.update({ isvisible: false }).eq('id', id);

    if (error)
      return {
        success: false,
        error: error.message || 'Failed to hide announcement',
      };

    revalidatePath('/admin-panel/announcements');

    return { success: true };
  } catch (error) {
    console.error('Error to hide announcement:', error);
    return { success: false, error: (error as Error).message };
  }
}
