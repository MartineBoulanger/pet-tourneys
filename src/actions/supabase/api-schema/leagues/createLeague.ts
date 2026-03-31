'use server';

import { revalidatePath } from 'next/cache';
import { sbServer } from '@/lib/supabase/server';
import { SCHEMA, Action, League } from '@/types/supabase.types';

// =================================================
// Create the additional tables
// - per league there are matches, etc. tables
// =================================================
export async function manageTables(action: Action, id: string) {
  const supabase = await sbServer();

  const { error } = await supabase
    .schema(SCHEMA.API)
    .rpc('manage_tournament_tables', {
      action,
      tournament_id: id,
    });

  if (error) {
    console.error('Table management error:', {
      error,
      action,
      id,
    });
    return {
      success: false,
      error: `Failed to ${action} tournament tables: ${error.message}`,
    };
  }

  return { success: true };
}

// =================================================
// Create a new league
// =================================================
export async function createLeague(data: Partial<League>) {
  if (!data.name?.trim())
    return { success: false, error: 'League name is required' };

  const leagueData = {
    name: data.name?.trim() || '',
    end_date: data.end_date || null,
    start_date: data.start_date || new Date().toISOString(),
    participant_count: data.participant_count || 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const supabase = await sbServer();

  // Create new tournament
  const { data: tournament, error } = await supabase
    .schema(SCHEMA.API)
    .from('tournaments')
    .insert(leagueData)
    .select()
    .single();

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  // Create tables after successful tournament creation
  const { success, error: err } = await manageTables('create', tournament.id);

  if (err)
    return {
      success,
      error: err,
    };

  revalidatePath('/admin-panel/leagues');

  return { success: true };
}
