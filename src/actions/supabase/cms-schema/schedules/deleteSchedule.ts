'use server';

import { revalidatePath } from 'next/cache';
import { schedulesTable } from '@/actions/supabase/actions';

// =================================================
// Delete schedule
// =================================================
export async function deleteSchedule(id: string) {
  try {
    if (!id) return { success: false, error: 'ID is required' };

    const cms = await schedulesTable();
    const { error } = await cms.delete().eq('id', id);

    if (error)
      return { success: false, error: error.message || 'Schedule not found' };

    revalidatePath('/admin-panel/content/schedules');

    return { success: true };
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return { success: false, error: (error as Error).message };
  }
}
