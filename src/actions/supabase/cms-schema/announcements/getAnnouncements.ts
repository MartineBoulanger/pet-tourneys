'use server';

import { announcementsTable } from '@/actions/supabase/actions';
import { Announcement } from '@/types/supabase.types';

// =================================================
// Get announcements
// =================================================
export async function getAnnouncements(): Promise<{
  success: boolean;
  data?: Announcement[];
  error?: string;
}> {
  try {
    const cms = await announcementsTable();

    const { data, error } = await cms
      .select('*')
      .order('createdat', { ascending: false });

    if (error)
      return {
        success: false,
        error: error.message || 'Announcements not found',
      };

    const processedAnnouncements = data?.map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      mediatype: a.mediatype,
      image: a.image as Announcement['image'],
      videourl: a.videourl,
      isvisible: a.isvisible,
      createdat: new Date(a.createdat || '').toLocaleString(),
      updatedat: new Date(a.updatedat || '').toLocaleString(),
    }));

    return {
      success: true,
      data: processedAnnouncements || [],
    };
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return { success: false, error: (error as Error).message };
  }
}

// =================================================
// Get announcement by visibility
// =================================================
export async function getAnnouncement() {
  try {
    const cms = await announcementsTable();

    const { data, error } = await cms
      .select('*')
      .eq('isvisible', true)
      .limit(1)
      .single();

    if (error)
      return {
        success: false,
        error: error.message || 'Visible announcement not found',
      };

    const processedAnnouncement = {
      id: data.id,
      title: data.title,
      description: data.description,
      mediatype: data.mediatype,
      image: data.image as Announcement['image'],
      videourl: data.videourl,
      isvisible: data.isvisible,
      createdat: new Date(data.createdat || '').toLocaleString(),
      updatedat: new Date(data.updatedat || '').toLocaleString(),
    };

    return {
      success: true,
      data: processedAnnouncement || null,
    };
  } catch (error) {
    console.error('Error fetching announcement:', error);
    return { success: false, error: (error as Error).message };
  }
}
