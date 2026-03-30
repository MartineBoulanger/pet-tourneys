'use server';

import { revalidatePath } from 'next/cache';
import { signupsTable } from '@/actions/supabase/actions';

// =================================================
// Delete signup
// =================================================
export async function deleteSignup(id: string) {
  try {
    if (!id) return { success: false, error: 'ID is required' };

    const cms = await signupsTable();
    const { error } = await cms.delete().eq('id', id);

    if (error)
      return { success: false, error: error.message || 'Signup not found' };

    revalidatePath('/admin-panel/content/signups');

    return { success: true };
  } catch (error) {
    console.error('Error deleting signup:', error);
    return { success: false, error: (error as Error).message };
  }
}
