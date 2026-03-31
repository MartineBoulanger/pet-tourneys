'use server';

import { revalidatePath } from 'next/cache';
import { apiTable } from '@/actions/supabase/actions';
import { parseBattleLog } from '@/utils/supabase/parseBattleLog';
import { parsePetUsage } from '@/utils/supabase/parsePetUsage';
import { updateLeaguePetStats } from '../statistics/updateLeaguePetStats';

// =================================================
// Update match
// =================================================
export async function updateMatchWithLogs(
  id: string,
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
  },
) {
  const m = await apiTable('matches', id);
  const pu = await apiTable('pet_usage', id);
  const bl = await apiTable('battle_logs', id);

  try {
    // 1. Update match metadata (always happens)
    const { error: matchError } = await m
      .update(matchUpdates)
      .eq('id', matchId);

    if (matchError) {
      console.error('Match update error:', matchError);
      throw matchError;
    }

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
        { owner: 0, opponent: 0 },
      );

      const outcome =
        scores.owner > scores.opponent
          ? 'WIN'
          : scores.opponent > scores.owner
            ? 'LOSS'
            : 'DRAW';

      // Update match with new scores
      const { error: scoresError } = await m
        .update({
          owner_score: scores.owner,
          opponent_score: scores.opponent,
          outcome,
        })
        .eq('id', matchId);

      if (scoresError) {
        console.error('Scores update error:', scoresError);
        throw scoresError;
      }

      // Replace logs
      const { error: deleteLogsError } = await bl
        .delete()
        .eq('match_id', matchId);

      if (deleteLogsError) {
        console.error('Delete logs error:', deleteLogsError);
        throw deleteLogsError;
      }

      if (battleLogs.length > 0) {
        const { error: insertLogsError } = await bl.insert(
          battleLogs.map((log) => ({ ...log, match_id: matchId })),
        );
        if (insertLogsError) {
          console.error('Insert logs error:', insertLogsError);
          throw insertLogsError;
        }
      }
    }

    // 3. Process pet usage if provided
    if (newPetUsageText !== null && newPetUsageText.trim() !== '') {
      const petUsage = parsePetUsage(newPetUsageText);

      const { error: deletePetError } = await pu
        .delete()
        .eq('match_id', matchId);

      if (deletePetError) {
        console.error('Delete pet usage error:', deletePetError);
        throw deletePetError;
      }

      if (petUsage.length > 0) {
        const { error: insertPetError } = await pu.insert(
          petUsage.map((pet) => ({ ...pet, match_id: matchId })),
        );

        if (insertPetError) {
          console.error('Insert pet usage error:', insertPetError);
          throw insertPetError;
        }

        // Update tournament stats if needed
        await updateLeaguePetStats(id, petUsage);
      }
    }

    revalidatePath(`/admin-panel/leagues/${id}/matches`);

    return { success: true };
  } catch (error) {
    console.error('Error updating match:', error);
    return {
      success: false,
      error: (error as Error).message || 'Failed to update match',
    };
  }
}
