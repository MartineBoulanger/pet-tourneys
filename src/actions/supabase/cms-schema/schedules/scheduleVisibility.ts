'use server';

import { revalidatePath } from 'next/cache';
import { schedulesTable } from '@/actions/supabase/actions';

// =================================================
// Set schedule visibility
// =================================================
export async function setVisibleSchedule(id: string) {
  try {
    if (!id) return { success: false, error: 'ID is required' };

    const cms = await schedulesTable();
    const { error } = await cms.select('*').eq('id', id).single();

    if (error)
      return {
        success: false,
        error: error.message || 'Visible schedule not set',
      };

    // Hide all other schedules
    const { error: hideError } = await cms
      .update({ isvisible: false })
      .in('isvisible', [true, false]);

    if (hideError)
      return {
        success: false,
        error: hideError.message || 'Failed to hide the other schedules',
      };

    // Set the specified schedule as visible
    const { error: showError } = await cms
      .update({ isvisible: true })
      .eq('id', id);

    if (showError)
      return {
        success: false,
        error: showError.message || 'Failed to set visible schedule',
      };

    revalidatePath('/admin-panel/content/schedules');

    return { success: true };
  } catch (error) {
    console.error('Error to set visible signup:', error);
    return { success: false, error: (error as Error).message };
  }
}

// =================================================
// Hide schedule
// =================================================
export async function hideSchedule(id: string) {
  try {
    if (!id) return { success: false, error: 'ID is required' };

    const cms = await schedulesTable();
    const { error } = await cms.update({ isvisible: false }).eq('id', id);

    if (error)
      return {
        success: false,
        error: error.message || 'Failed to hide schedule',
      };

    revalidatePath('/admin-panel/content/schedules');

    return { success: true };
  } catch (error) {
    console.error('Error to hide schedule:', error);
    return { success: false, error: (error as Error).message };
  }
}
