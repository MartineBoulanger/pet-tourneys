'use server';

import { revalidatePath } from 'next/cache';
// import { sbApiStatic } from '@/lib/supabase/static';
import { sbServer } from '@/lib/supabase/server';
import { SCHEMA, League } from '@/types/supabase.types';

// =================================================
// Update a league
// =================================================
export async function updateLeague(id: string, data: Partial<League>) {
  if (!id) return { success: false, error: 'ID is required' };
  if (!data.name?.trim())
    return { success: false, error: 'League name is required' };

  const updateData = {
    name: data.name?.trim() || '',
    end_date: data.end_date || null,
    start_date: data.start_date || new Date().toISOString(),
    participant_count: data.participant_count ?? 0,
    updated_at: new Date().toISOString(),
  };

  const supabase = await sbServer();

  const { error } = await supabase
    .schema(SCHEMA.API)
    .from('tournaments')
    .update(updateData)
    .eq('id', id);

  if (error) {
    return {
      success: false,
      error: `Failed to update league: ${error.message}`,
    };
  }

  revalidatePath('/admin-panel/leagues');

  return { success: true };
}
