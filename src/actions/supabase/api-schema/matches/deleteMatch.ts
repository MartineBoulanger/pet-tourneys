'use server';

import { revalidatePath } from 'next/cache';
import { apiTable } from '@/actions/supabase/actions';
import { PetUsage } from '@/types/supabase.types';

// =================================================
// Delete match
// =================================================
export async function deleteMatch(id: string, matchId: string) {
  try {
    const m = await apiTable('matches', id);
    const pu = await apiTable('pet_usage', id);
    const bl = await apiTable('battle_logs', id);
    const lps = await apiTable('tournament_pet_stats', id);

    // 1. Delete battle logs
    const { error: logsError } = await bl.delete().eq('match_id', matchId);
    if (logsError) throw logsError;

    // 2. Delete pet usage records
    const { error: petUsageError } = await pu.delete().eq('match_id', matchId);
    if (petUsageError) throw petUsageError;

    // 3. Delete the match
    const { error: matchError } = await m.delete().eq('id', matchId);
    if (matchError) throw matchError;

    // 4. Rebuild tournament stats from scratch (simple but reliable)
    const { data: remainingPets } = await pu.select('*');

    const statsData = remainingPets?.reduce((acc, pet) => {
      const existing = acc.find(
        (p: PetUsage) => p.pet_data.name === pet.pet_data.name,
      );
      if (existing) {
        existing.total_played += pet.total_played;
      } else {
        acc.push({
          pet_data: pet.pet_data,
          total_played: pet.total_played,
          tournament_id: id,
        });
      }
      return acc;
    }, []);

    // 5. Replace all tournament stats
    await lps.delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Workaround for empty delete

    if (statsData?.length) {
      await lps.insert(statsData);
    }

    revalidatePath(`/admin-panel/leagues/${id}/matches`);

    return { success: true };
  } catch (error) {
    console.error('Error deleting match:', error);
    return { success: false, error: (error as Error).message };
  }
}
