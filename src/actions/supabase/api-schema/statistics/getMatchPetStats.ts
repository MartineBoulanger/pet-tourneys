'use server';

import { apiTable } from '@/actions/supabase/actions';
import { LeaguePetStat } from '@/types/supabase.types';

export async function getMatchPetStats(
  id: string,
  matchId: string,
): Promise<LeaguePetStat[]> {
  const pu = await apiTable('pet_usage', id);

  // Only use match-specific records
  const { data: records, error } = await pu.select('*').eq('match_id', matchId);

  if (error) throw error;
  if (!records) return [];

  return records
    .map((record) => ({
      id: record.id,
      pet_data: record.pet_data,
      total_played: record.pet_data.times_played.reduce(
        (a: number, b: number) => a + b,
        0,
      ),
      breed_stats: record.pet_data.breeds.map((breed: string, i: number) => ({
        breed,
        stats: record.pet_data.stats[i] || '',
        times_played: record.pet_data.times_played[i] || 0,
      })),
      match_count: 1,
    }))
    .sort((a, b) => b.total_played - a.total_played);
}
