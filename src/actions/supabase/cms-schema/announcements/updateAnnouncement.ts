'use server';

import { revalidatePath } from 'next/cache';
import { announcementsTable } from '@/actions/supabase/actions';
import { Announcement } from '@/types/supabase.types';

// =================================================
// Update announcement
// =================================================
export async function updateAnnouncement(
  id: string,
  data: Partial<Announcement>,
) {
  try {
    if (!id) return { success: false, error: 'ID is required' };

    if (data.mediatype === 'image' && !data.image) {
      return {
        success: false,
        error: 'Image is required when media type is image',
      };
    }

    if (data.mediatype === 'video' && !data.videourl?.trim()) {
      return {
        success: false,
        error: 'Video URL is required when media type is video',
      };
    }

    const cms = await announcementsTable();

    const announcementData = {
      title: data.title?.trim() || undefined,
      description: data.description?.trim() || undefined,
      mediatype: data.mediatype || 'none',
      image: data.mediatype === 'image' ? data.image : null,
      videourl: data.mediatype === 'video' ? data.videourl?.trim() : undefined,
      isvisible: data.isvisible ?? true,
      updatedat: new Date().toISOString(),
    };

    const { error } = await cms.update(announcementData).eq('id', id);

    if (error)
      return {
        success: false,
        error: error.message || 'Announcement not found',
      };

    revalidatePath('/admin-panel/announcements');

    return { success: true };
  } catch (error) {
    console.error('Error updating announcement:', error);
    return { success: false, error: (error as Error).message };
  }
}
