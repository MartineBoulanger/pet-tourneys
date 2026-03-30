'use server';

import { revalidatePath } from 'next/cache';
import { halloffameTable } from '@/actions/supabase/actions';

// =================================================
// delete a hall of fame item
// =================================================
export async function deleteHalloffame(id: string) {
  try {
    if (!id) return { success: false, error: 'ID is required' };

    const hof = await halloffameTable();

    const { error } = await hof.delete().eq('id', id);

    if (error)
      return {
        success: false,
        error: error.message || 'Hall of Fame item not found',
      };

    revalidatePath('/admin-panel/leagues/hall-of-fame');

    return { success: true };
  } catch (error) {
    console.error('Error deleting hall of fame item:', error);
    return { success: false, error: (error as Error).message };
  }
}
