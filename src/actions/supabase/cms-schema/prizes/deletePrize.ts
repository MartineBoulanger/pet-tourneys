'use server';

import { revalidatePath } from 'next/cache';
import { prizesTable } from '@/actions/supabase/actions';

// =================================================
// Delete prize
// =================================================
export async function deletePrize(id: string) {
  try {
    if (!id) return { success: false, error: 'ID is required' };

    const prize = await prizesTable();

    const { error } = await prize.delete().eq('id', id);

    if (error)
      return { success: false, error: error.message || 'Prize not found' };

    revalidatePath('/admin-panel/leagues/prizes');

    return { success: true };
  } catch (error) {
    console.error('Error deleting prize:', error);
    return { success: false, error: (error as Error).message };
  }
}
