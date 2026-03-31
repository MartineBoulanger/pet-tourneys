'use server';

import { revalidatePath } from 'next/cache';
import { signupsTable } from '@/actions/supabase/actions';

// =================================================
// Set signup visibility
// =================================================
export async function setVisibleSignup(id: string) {
  try {
    if (!id) return { success: false, error: 'ID is required' };

    const cms = await signupsTable();
    const { error } = await cms.select('*').eq('id', id).single();

    if (error)
      return {
        success: false,
        error: error.message || 'Visible signup not set',
      };

    // Hide all other signups
    const { error: hideError } = await cms
      .update({ isvisible: false })
      .in('isvisible', [true, false]);

    if (hideError)
      return {
        success: false,
        error: hideError.message || 'Failed to hide the other signups',
      };

    // Set the specified signup as visible
    const { error: showError } = await cms
      .update({ isvisible: true })
      .eq('id', id);

    if (showError)
      return {
        success: false,
        error: showError.message || 'Failed to set visible signup',
      };

    revalidatePath('/admin-panel/content/signups');

    return { success: true };
  } catch (error) {
    console.error('Error to set visible signup:', error);
    return { success: false, error: (error as Error).message };
  }
}

// =================================================
// Hide signup
// =================================================
export async function hideSignup(id: string) {
  try {
    if (!id) return { success: false, error: 'ID is required' };

    const cms = await signupsTable();
    const { error } = await cms.update({ isvisible: false }).eq('id', id);

    if (error)
      return {
        success: false,
        error: error.message || 'Failed to hide signup',
      };

    revalidatePath('/admin-panel/content/signups');

    return { success: true };
  } catch (error) {
    console.error('Error to hide signup:', error);
    return { success: false, error: (error as Error).message };
  }
}
