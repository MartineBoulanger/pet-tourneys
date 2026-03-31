'use server';

import { revalidatePath } from 'next/cache';
import { partnersTable } from '@/actions/supabase/actions';

// =================================================
// Delete partner
// =================================================
export async function deletePartner(id: string) {
  try {
    if (!id) return { success: false, error: 'ID is required' };

    const partner = await partnersTable();

    const { error } = await partner.delete().eq('id', id);

    if (error)
      return {
        success: false,
        error: error.message || 'Partner not found',
      };

    revalidatePath('/admin-panel/content/partners');

    return { success: true };
  } catch (error) {
    console.error('Error deleting partner:', error);
    return { success: false, error: (error as Error).message };
  }
}
