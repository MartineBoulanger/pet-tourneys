'use server';

import { revalidatePath } from 'next/cache';
import { rulesTable } from '@/actions/supabase/actions';

// =================================================
// Delete rule
// =================================================
export async function deleteRule(id: string) {
  try {
    if (!id) return { success: false, error: 'ID is required' };

    const rule = await rulesTable();

    const { error } = await rule.delete().eq('id', id);

    if (error)
      return { success: false, error: error.message || 'Rule not found' };

    revalidatePath('/admin-panel/leagues/rules');

    return { success: true };
  } catch (error) {
    console.error('Error deleting rule:', error);
    return { success: false, error: (error as Error).message };
  }
}
