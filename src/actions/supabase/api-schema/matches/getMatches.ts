'use server';

import { apiTable } from '@/actions/supabase/actions';
import { Match, BattleLog } from '@/types/supabase.types';

// =================================================
// Get matches
// =================================================
export async function getMatches(id: string) {
  try {
    const m = await apiTable('matches', id);

    const { data, error } = await m.select('*').eq('is_forfeit', false);

    if (error)
      return {
        success: false,
        error: error.message,
      };

    return { success: true, data: data as Match[] };
  } catch (error) {
    console.error('Error fetching matches:', error);
    return { success: false, error: (error as Error).message };
  }
}

// =================================================
// Get a match
// =================================================
export async function getMatch(id: string, matchId: string) {
  try {
    const m = await apiTable('matches', id);

    const { data, error } = await m.select('*').eq('id', matchId).single();

    if (error)
      return {
        success: false,
        error: error.message,
      };

    return { success: true, data: data as Match };
  } catch (error) {
    console.error('Error fetching match:', error);
    return { success: false, error: (error as Error).message };
  }
}

// =================================================
// Get match details
// =================================================
export const getMatchDetails = async (id: string, matchId: string) => {
  try {
    const m = await apiTable('matches', id);
    const bl = await apiTable('battle_logs', id);

    // Get match details
    const { data: match, error: err } = await m
      .select('*')
      .eq('id', matchId)
      .single();

    if (err) {
      return {
        success: false,
        error: err.message,
      };
    }

    // Get battles for this match
    const { data: battleLogs, error } = await bl
      .select('*')
      .eq('match_id', matchId)
      .order('timestamp', { ascending: true });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: {
        match: match as Match,
        battleLogs: battleLogs as BattleLog[],
      },
    };
  } catch (error) {
    console.error('Error fetching match:', error);
    return { success: false, error: (error as Error).message };
  }
};

// =================================================
// Get paginated matches
// =================================================
export async function getPaginatedMatches(
  id: string,
  offset: number,
  matchesPerPage: number,
  shouldIncludeForfeits: boolean = false,
) {
  try {
    const m = await apiTable('matches', id);

    let query = m
      .select('*', { count: 'exact' })
      .order('date', { ascending: false })
      .range(offset, offset + matchesPerPage - 1);

    if (!shouldIncludeForfeits) {
      query = query.eq('is_forfeit', false);
    }

    const { data: matches, count, error } = await query;

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    const totalPages = Math.ceil(Number(count) / matchesPerPage);

    return {
      success: true,
      data: matches as Match[],
      totalPages,
    };
  } catch (error) {
    console.error('Error fetching matches:', error);
    return { success: false, error: (error as Error).message };
  }
}
