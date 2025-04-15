'use server';

import { createClient } from '@/supabase/server';
import { getTournamentTableName } from '@/utils/getTournamentTableName';

type Action = 'create' | 'drop';

export async function manageTournamentTables(
  action: Action,
  tournamentId: string
) {
  const supabase = await createClient();

  const { error } = await supabase
    .schema('api')
    .rpc('manage_tournament_tables', {
      action,
      tournament_id: tournamentId,
    });

  if (error) {
    console.error('Table management error:', {
      error,
      action,
      tournamentId,
    });
    throw new Error(`Failed to ${action} tournament tables: ${error.message}`);
  }

  return { success: true };
}

// server action for tournament deletion
export async function deleteTournament(tournamentId: string) {
  const supabase = await createClient();

  // Start by dropping the tournament tables
  const { error: tableError } = await supabase
    .schema('api')
    .rpc('manage_tournament_tables', {
      action: 'drop',
      tournament_id: tournamentId,
    });

  if (tableError) {
    console.error('Failed to drop tables:', tableError);
    throw new Error(
      `Failed to delete tournament tables: ${tableError.message}`
    );
  }

  // Then delete the tournament record
  const { error } = await supabase
    .schema('api')
    .from('tournaments')
    .delete()
    .eq('id', tournamentId);

  if (error) {
    console.error('Failed to delete tournament:', error);
    throw new Error(`Failed to delete tournament record: ${error.message}`);
  }

  return { success: true };
}

// server action to create a new tournament
export async function createTournament(data: {
  name?: string;
  start_date?: string;
  end_date?: string | null;
  participant_count?: number;
}) {
  const supabase = await createClient();

  // Create new tournament
  const { data: tournament, error } = await supabase
    .schema('api')
    .from('tournaments')
    .insert([data])
    .select()
    .single();

  if (error) throw error;

  // Create tables after successful tournament creation
  await manageTournamentTables('create', tournament.id);

  return { success: true };
}

//  server action to update the tournament
export async function updateTournament(
  tournamentId: string,
  data: {
    name?: string;
    start_date?: string;
    end_date?: string | null;
    participant_count?: number;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .schema('api')
    .from('tournaments')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', tournamentId);

  if (error) {
    console.error('Update error:', error);
    throw new Error(`Failed to update tournament: ${error.message}`);
  }

  return { success: true };
}

// Get all tournaments sorted on start date
export const getTournaments = async () => {
  const supabase = await createClient();

  const { data: tournaments, error } = await supabase
    .schema('api')
    .from('tournaments')
    .select('*')
    .order('start_date', { ascending: false });

  if (error) {
    return {
      success: false,
      status: 500,
      message: error.message,
      data: {},
    };
  }

  return {
    success: true,
    status: 200,
    message: null,
    data: { tournaments },
  };
};

// Get only the tournament data
export const getTournament = async (id: string) => {
  const supabase = await createClient();

  const { data: tournament, error: tournamentError } = await supabase
    .schema('api')
    .from('tournaments')
    .select('*')
    .eq('id', id)
    .single();

  if (tournamentError) {
    return {
      success: false,
      status: 500,
      message: tournamentError.message,
      data: {},
    };
  }

  return {
    success: true,
    status: 200,
    message: null,
    data: { tournament },
  };
};

// For getting single tournament details
export const getTournamentDetails = async (id: string) => {
  const supabase = await createClient();
  const matchesTable = getTournamentTableName('matches', id);

  // First get the tournament details
  const { data: tournament, error: tournamentError } = await supabase
    .schema('api')
    .from('tournaments')
    .select('*')
    .eq('id', id)
    .single();

  if (tournamentError) {
    return {
      success: false,
      status: 500,
      message: tournamentError.message,
      data: {},
    };
  }

  // Get matches from the tournament-specific table
  const { data: matches, error: matchesError } = await supabase
    .schema('api')
    .from(matchesTable)
    .select('*')
    .order('date', { ascending: false });

  if (matchesError) {
    return {
      success: false,
      status: 500,
      message: `Failed to fetch matches: ${matchesError.message}`,
      data: { tournament, matches: [] },
    };
  }

  return {
    success: true,
    status: 200,
    message: null,
    data: { tournament, matches },
  };
};
