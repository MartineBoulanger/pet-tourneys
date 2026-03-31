'use server';

import { revalidatePath } from 'next/cache';
import { sbServer } from '@/lib/supabase/server';
import { manageTables } from './createLeague';
import { SCHEMA } from '@/types/supabase.types';

// =================================================
// Delete a league
// =================================================
export async function deleteLeague(id: string) {
  const supabase = await sbServer();
  const { error: err } = await manageTables('drop', id);

  if (err) {
    return {
      success: false,
      error: `Failed to drop tables: ${err}`,
    };
  }

  // Then delete the tournament record
  const { error } = await supabase
    .schema(SCHEMA.API)
    .from('tournaments')
    .delete()
    .eq('id', id);

  if (error) {
    return {
      success: false,
      error: `Failed to delete league: ${error.message}`,
    };
  }

  revalidatePath('/admin-panel/leagues');

  return { success: true };
}
