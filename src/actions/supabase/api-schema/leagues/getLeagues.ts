'use server';

import { sbServer } from '@/lib/supabase/server';
import { SCHEMA, League, Match } from '@/types/supabase.types';
import { apiTable } from '@/actions/supabase/actions';

// =================================================
// Get leagues
// =================================================
export const getLeagues = async (
  offset: number,
  leaguesPerPage: number,
): Promise<{
  success: boolean;
  error?: string;
  data?: League[];
  totalPages?: number;
}> => {
  const supabase = await sbServer();

  const { data, count, error } = await supabase
    .schema(SCHEMA.API)
    .from('tournaments')
    .select('*', { count: 'exact' })
    .order('start_date', { ascending: false })
    .range(offset, offset + leaguesPerPage - 1);

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  const totalPages = Math.ceil(Number(count) / leaguesPerPage);

  return {
    success: true,
    data,
    totalPages,
  };
};

// =================================================
// Get leagues
// - this call is for the upload form for the logs
// =================================================
export const getLeaguesForForm = async (): Promise<{
  success: boolean;
  error?: string;
  data?: League[];
}> => {
  const supabase = await sbServer();

  const { data, error } = await supabase
    .schema(SCHEMA.API)
    .from('tournaments')
    .select('*');

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    data,
  };
};

// =================================================
// Get a league
// =================================================
export const getLeague = async (
  id: string,
): Promise<{
  success: boolean;
  error?: string;
  data?: League;
}> => {
  const supabase = await sbServer();

  const { data, error } = await supabase
    .schema(SCHEMA.API)
    .from('tournaments')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    data,
  };
};

// =================================================
// Get league details
// =================================================
export const getLeagueDetails = async (
  id: string,
): Promise<{
  success: boolean;
  error?: string;
  data?: {
    league?: League;
    matches?: Match[];
  };
}> => {
  const supabase = await sbServer();
  const m = await apiTable('matches', id);

  // First get the league details
  const { data: league, error: leagueError } = await supabase
    .schema(SCHEMA.API)
    .from('tournaments')
    .select('*')
    .eq('id', id)
    .single();

  if (leagueError) {
    return {
      success: false,
      error: leagueError.message,
    };
  }

  // Get matches from the league-specific table
  const { data: matches, error: matchesError } = await m
    .select('*')
    .order('date', { ascending: false });

  if (matchesError) {
    return {
      success: false,
      error: `Failed to fetch matches: ${matchesError.message}`,
      data: { league },
    };
  }

  return {
    success: true,
    data: { league, matches },
  };
};
