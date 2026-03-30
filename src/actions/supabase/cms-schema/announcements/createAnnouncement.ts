'use server';

import { revalidatePath } from 'next/cache';
import { announcementsTable } from '@/actions/supabase/actions';
import { Announcement } from '@/types/supabase.types';

// =================================================
// Create announcement
// =================================================
export async function createAnnouncement(data: Partial<Announcement>) {
  try {
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
      createdat: new Date().toISOString(),
      updatedat: new Date().toISOString(),
    };

    const { data: result, error } = await cms
      .insert(announcementData)
      .select('*')
      .single();

    if (error)
      return {
        success: false,
        error: error.message || 'Announcement not created',
      };

    revalidatePath('/admin-panel/announcements');

    return {
      success: true,
      announcement: {
        id: result?.id || '',
        title: result?.title || announcementData.title || '',
        description: result?.description || announcementData.description || '',
        mediatype: result?.mediatype || announcementData.mediatype || 'none',
        image: result?.image || announcementData.image || null,
        videourl: result?.videourl || announcementData.videourl || undefined,
        isvisible: result?.isvisible ?? announcementData.isvisible ?? true,
        createdat: new Date(
          result?.createdat || announcementData.createdat,
        ).toISOString(),
        updatedat: new Date(
          result?.updatedat || announcementData.updatedat,
        ).toISOString(),
      },
    };
  } catch (error) {
    console.error('Error creating announcement:', error);
    return { success: false, error: (error as Error).message };
  }
}
