'use server';

import { createClient } from '../server';
import { getTournamentTableName } from '../utils/getTournamentTableName';
import { parseBattleLog } from '../utils/battleLogParser';
import { parsePetUsage } from '../utils/petUsageParser';
import { PetData } from '../types';
import { updateTournamentPetStats } from './uploadLogs';

interface PetUsage extends PetData {
  id: string;
  match_id: string;
}

export async function getMatch(tournamentId: string, matchId: string) {
  const supabase = await createClient();
  const matchesTable = getTournamentTableName('matches', tournamentId);

  const { data } = await supabase
    .schema('api')
    .from(matchesTable)
    .select('*')
    .eq('id', matchId)
    .single();

  return data;
}

export async function getMatches(tournamentId: string) {
  const supabase = await createClient();
  const matchesTable = getTournamentTableName('matches', tournamentId);

  const { data } = await supabase.schema('api').from(matchesTable).select('*');

  return data;
}

export const getMatchDetails = async (
  tournamentId: string,
  matchId: string
) => {
  const supabase = await createClient();
  const matchesTable = getTournamentTableName('matches', tournamentId);
  const battleLogsTable = getTournamentTableName('battle_logs', tournamentId);

  // Get match details
  const { data: match, error: matchErr } = await supabase
    .schema('api')
    .from(matchesTable)
    .select('*')
    .eq('id', matchId)
    .single();

  if (matchErr) {
    return {
      success: false,
      status: 500,
      message: matchErr.message,
      data: {},
    };
  }

  // Get battles for this match
  const { data: battleLogs, error: logErr } = await supabase
    .schema('api')
    .from(battleLogsTable)
    .select('*')
    .eq('match_id', matchId)
    .order('timestamp', { ascending: true });

  if (logErr) {
    return {
      success: false,
      status: 500,
      message: logErr.message,
      data: {},
    };
  }

  return {
    success: true,
    status: 200,
    message: null,
    data: {
      match,
      battleLogs,
    },
  };
};

export async function deleteMatch(tournamentId: string, matchId: string) {
  const supabase = await createClient();
  const matchesTable = getTournamentTableName('matches', tournamentId);
  const petUsageTable = getTournamentTableName('pet_usage', tournamentId);
  const battleLogsTable = getTournamentTableName('battle_logs', tournamentId);
  const tournamentPetStatsTable = getTournamentTableName(
    'tournament_pet_stats',
    tournamentId
  );

  // 1. Delete battle logs
  const { error: logsError } = await supabase
    .schema('api')
    .from(battleLogsTable)
    .delete()
    .eq('match_id', matchId);

  if (logsError) throw logsError;

  // 2. Delete pet usage records
  const { error: petUsageError } = await supabase
    .schema('api')
    .from(petUsageTable)
    .delete()
    .eq('match_id', matchId);

  if (petUsageError) throw petUsageError;

  // 3. Delete the match
  const { error: matchError } = await supabase
    .schema('api')
    .from(matchesTable)
    .delete()
    .eq('id', matchId);

  if (matchError) throw matchError;

  // 4. Rebuild tournament stats from scratch (simple but reliable)
  const { data: remainingPets } = await supabase
    .schema('api')
    .from(petUsageTable)
    .select('*');

  const statsData = remainingPets?.reduce((acc, pet) => {
    const existing = acc.find(
      (p: PetUsage) => p.pet_data.name === pet.pet_data.name
    );
    if (existing) {
      existing.total_played += pet.total_played;
    } else {
      acc.push({
        pet_data: pet.pet_data,
        total_played: pet.total_played,
        tournament_id: tournamentId,
      });
    }
    return acc;
  }, []);

  // 5. Replace all tournament stats
  await supabase
    .schema('api')
    .from(tournamentPetStatsTable)
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Workaround for empty delete

  if (statsData?.length) {
    await supabase
      .schema('api')
      .from(tournamentPetStatsTable)
      .insert(statsData);
  }

  return { success: true };
}

export async function updateMatchWithLogs(
  tournamentId: string,
  matchId: string,
  {
    matchUpdates,
    newLogsText = null, // Make optional
    newPetUsageText = null, // Make optional
  }: {
    matchUpdates: {
      player1: string;
      player2: string;
      owner: string;
      date: string;
      region: string;
    };
    newLogsText?: string | null;
    newPetUsageText?: string | null;
  }
) {
  const supabase = await createClient();
  const matchesTable = getTournamentTableName('matches', tournamentId);
  const petUsageTable = getTournamentTableName('pet_usage', tournamentId);
  const battleLogsTable = getTournamentTableName('battle_logs', tournamentId);

  try {
    // 1. Update match metadata (always happens)
    const { error: matchError } = await supabase
      .schema('api')
      .from(matchesTable)
      .update(matchUpdates)
      .eq('id', matchId);

    if (matchError) throw matchError;

    // 2. Only process logs if new text is provided and not empty string
    if (newLogsText !== null && newLogsText.trim() !== '') {
      const battleLogs = parseBattleLog(newLogsText);

      // Calculate scores from new logs (same logic as uploadBattleLog)
      const scores = battleLogs.reduce(
        (acc, log) => {
          if (log.result === 'WIN') acc.owner++;
          if (log.result === 'LOSS') acc.opponent++;
          return acc;
        },
        { owner: 0, opponent: 0 }
      );

      const outcome =
        scores.owner > scores.opponent
          ? 'WIN'
          : scores.opponent > scores.owner
          ? 'LOSS'
          : 'DRAW';

      // Update match with new scores
      await supabase
        .schema('api')
        .from(matchesTable)
        .update({
          owner_score: scores.owner,
          opponent_score: scores.opponent,
          outcome,
        })
        .eq('id', matchId);

      // Replace logs
      await supabase
        .schema('api')
        .from(battleLogsTable)
        .delete()
        .eq('match_id', matchId);

      if (battleLogs.length > 0) {
        await supabase
          .schema('api')
          .from(battleLogsTable)
          .insert(battleLogs.map((log) => ({ ...log, match_id: matchId })));
      }
    }

    // 3. Process pet usage if provided
    if (newPetUsageText !== null && newPetUsageText.trim() !== '') {
      const petUsage = parsePetUsage(newPetUsageText);

      await supabase
        .schema('api')
        .from(petUsageTable)
        .delete()
        .eq('match_id', matchId);

      if (petUsage.length > 0) {
        await supabase
          .schema('api')
          .from(petUsageTable)
          .insert(petUsage.map((pet) => ({ ...pet, match_id: matchId })));

        // Update tournament stats if needed
        await updateTournamentPetStats(tournamentId, petUsage);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating match:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update match',
    };
  }
}

export async function getPaginatedMatches(
  tournamentId: string,
  offset: number,
  matchesPerPage: number
) {
  const supabase = await createClient();
  const matchesTable = getTournamentTableName('matches', tournamentId);

  const {
    data: matches,
    count,
    error,
  } = await supabase
    .schema('api')
    .from(matchesTable)
    .select('*', { count: 'exact' })
    .order('date', { ascending: false })
    .range(offset, offset + matchesPerPage - 1);

  if (error) {
    return {
      success: false,
      status: 500,
      message: error.message,
      data: {},
    };
  }

  const totalPages = Math.ceil(Number(count) / matchesPerPage);

  return {
    success: true,
    status: 200,
    message: null,
    data: {
      matches,
      totalPages,
    },
  };
}
