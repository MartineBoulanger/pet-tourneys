'use server';

import { schedulesTable } from '@/actions/supabase/actions';
import { Schedule } from '@/types/supabase.types';

// =================================================
// Get schedules
// =================================================
export async function getSchedules(): Promise<{
  success: boolean;
  data?: Schedule[];
  error?: string;
}> {
  try {
    const cms = await schedulesTable();

    const { data, error } = await cms
      .select('*')
      .order('createdat', { ascending: false });

    if (error)
      return {
        success: false,
        error: error.message || 'Schedules not found',
      };

    const processedSchedules = data?.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      images: s.images as Schedule['images'],
      layout: s.layout,
      isvisible: s.isvisible,
      createdat: new Date(s.createdat || '').toLocaleString(),
      updatedat: new Date(s.updatedat || '').toLocaleString(),
    }));

    return { success: true, data: processedSchedules || [] };
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return { success: false, error: (error as Error).message };
  }
}

// =================================================
// Get schedule by visibility
// =================================================
export async function getSchedule() {
  try {
    const cms = await schedulesTable();
    const { data, error } = await cms
      .select('*')
      .eq('isvisible', true)
      .limit(1)
      .single();

    if (error)
      return {
        success: false,
        error: error.message || 'Visible schedule not found',
      };

    const processedSchedule = {
      id: data.id,
      title: data.title,
      description: data.description,
      images: data.images as Schedule['images'],
      layout: data.layout,
      isvisible: data.isvisible,
      createdat: new Date(data.createdat || '').toLocaleString(),
      updatedat: new Date(data.updatedat || '').toLocaleString(),
    };

    return { success: true, data: processedSchedule || null };
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return { success: false, error: (error as Error).message };
  }
}
