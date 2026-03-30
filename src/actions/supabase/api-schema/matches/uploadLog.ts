'use server';

import { revalidatePath } from 'next/cache';
import { apiTable } from '@/actions/supabase/actions';
import { UploadProps } from '@/types/supabase.types';
import { updateLeaguePetStats } from '../statistics/updateLeaguePetStats';
import { parseBattleLog } from '@/utils/supabase/parseBattleLog';
import { parsePetUsage } from '@/utils/supabase/parsePetUsage';

// =================================================
// Create match + statistics
// =================================================
export async function uploadLog(props: UploadProps) {
  const { logs, petUsage, tournament_id, region, is_forfeit, ...matchData } =
    props;
  const m = await apiTable('matches', tournament_id);
  const bl = await apiTable('battle_logs', tournament_id);
  const pu = await apiTable('pet_usage', tournament_id);

  try {
    // 🟡 FORFEIT LOGIC
    if (is_forfeit) {
      const winner = matchData.owner;
      const match = {
        ...matchData,
        region,
        is_forfeit: true,
        owner_score: 1,
        opponent_score: 0,
        outcome: 'FORFEIT',
        owner: winner,
        date: new Date().toISOString(),
      };

      const { error: forfeitError } = await m.insert(match);

      if (forfeitError) throw forfeitError;

      revalidatePath(`/admin-panel/leagues/${tournament_id}/matches`);

      return {
        success: true,
        message: 'Forfeit match recorded successfully',
      };
    }

    // Validate
    if (!logs || !petUsage)
      throw new Error(
        'Battle log and pet usage are required unless this is a forfeit match',
      );

    // Parse battle logs
    const battleLogs = parseBattleLog(logs);
    if (!battleLogs?.length) throw new Error('No valid battle logs found');

    // Calculate scores
    const scores = battleLogs.reduce(
      (acc, log) => {
        if (log.result === 'WIN') acc.owner++;
        if (log.result === 'LOSS') acc.opponent++;
        return acc;
      },
      { owner: 0, opponent: 0 },
    );

    const outcome =
      scores.owner > scores.opponent
        ? 'WIN'
        : scores.opponent > scores.owner
          ? 'LOSS'
          : 'DRAW';

    const newMatch = {
      ...matchData,
      region,
      owner_score: scores.owner,
      opponent_score: scores.opponent,
      outcome,
      date: matchData.date
        ? new Date(matchData.date).toISOString()
        : new Date().toISOString(),
      is_forfeit: false,
    };

    // Create match record
    const { data: match, error: matchError } = await m
      .insert(newMatch)
      .select()
      .single();

    if (matchError) throw matchError;
    if (!match?.id) throw new Error('Failed to create match - no ID returned');

    // Insert battle logs
    const { error: logError } = await bl.insert(
      battleLogs.map((log) => ({
        ...log,
        match_id: match.id,
      })),
    );

    if (logError) throw logError;

    // Process pet usage
    const parsedPets = parsePetUsage(petUsage);
    if (parsedPets.length === 0) {
      console.warn('No valid pets to process');
    }

    const matchPetUsages = parsedPets.map((pet) => ({
      match_id: match.id,
      pet_data: pet.pet_data,
      total_played: pet.total_played,
    }));

    const { error: petUsageError } = await pu.insert(matchPetUsages);

    if (petUsageError) throw petUsageError;

    await updateLeaguePetStats(tournament_id, parsedPets);

    revalidatePath(`/admin-panel/leagues/${tournament_id}/matches`);

    return {
      success: true,
      matchId: match.id,
      battlesProcessed: battleLogs.length,
      petsProcessed: parsedPets.length,
    };
  } catch (error) {
    console.error('Upload failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}
