'use server';

import { apiTable } from '@/actions/supabase/actions';
import { Match, BattleLog } from '@/types/supabase.types';
import { getAvailableRegions } from '@/utils/supabase/getAvailableRegions';
import { analyzePlayerAndPetStats } from '@/utils/supabase/analyzePlayerAndPetStats';

// =================================================
// Get players
// =================================================
export async function getPlayerRecords(id: string) {
  const m = await apiTable('matches', id);
  const bl = await apiTable('battle_logs', id);

  const { data: matches, error } = await m.select('*');
  const { data: logs, error: logsError } = await bl.select('*');

  if (error || logsError) {
    console.error('Error fetching data:', error || logsError);
    return { error: error?.message || logsError?.message };
  }

  const regions = getAvailableRegions(matches as Match[]);
  const records = await analyzePlayerAndPetStats(
    matches as Match[],
    logs as BattleLog[],
  );

  return { records, regions };
}
