'use server';

import { createClient } from '@/supabase/server';
import { getTournamentTableName } from '@/utils/getTournamentTableName';
import { TournamentPetStat } from '@/types';

export async function getTournamentPetStats(
  tournamentId: string
): Promise<TournamentPetStat[]> {
  const supabase = await createClient();
  const petUsageTable = getTournamentTableName('pet_usage', tournamentId);

  // Only use aggregated records for tournament view
  const { data: records, error } = await supabase
    .schema('api')
    .from(petUsageTable)
    .select('*');

  if (error) throw error;
  if (!records) return [];

  const petMap = new Map<string, TournamentPetStat>();

  for (const record of records) {
    const existing = petMap.get(record.pet_data.name);

    if (existing) {
      // Merge with existing record
      record.pet_data.breeds.forEach((breed: string, i: number) => {
        const existingBreed = existing.breed_stats.find(
          (bs) => bs.breed === breed
        );
        if (existingBreed) {
          existingBreed.times_played += record.pet_data.times_played[i] || 0;
          // Keep the most recent stats if they exist
          if (record.pet_data.stats[i]) {
            existingBreed.stats = record.pet_data.stats[i];
          }
        } else {
          existing.breed_stats.push({
            breed,
            stats: record.pet_data.stats[i] || '',
            times_played: record.pet_data.times_played[i] || 0,
          });
        }
      });

      // Update totals
      existing.total_played += record.total_played;
      existing.match_count += 1;
    } else {
      // Create new entry
      petMap.set(record.pet_data.name, {
        id: record.id,
        pet_data: record.pet_data,
        total_played: record.total_played,
        breed_stats: record.pet_data.breeds.map((breed: string, i: number) => ({
          breed,
          stats: record.pet_data.stats[i] || '',
          times_played: record.pet_data.times_played[i] || 0,
        })),
        match_count: 1,
      });
    }
  }

  return Array.from(petMap.values()).sort(
    (a, b) => b.total_played - a.total_played
  );
}

export async function getMatchPetUsage(
  tournamentId: string,
  matchId: string
): Promise<TournamentPetStat[]> {
  const supabase = await createClient();
  const petUsageTable = getTournamentTableName('pet_usage', tournamentId);

  // Only use match-specific records
  const { data: records, error } = await supabase
    .schema('api')
    .from(petUsageTable)
    .select('*')
    .eq('match_id', matchId);

  if (error) throw error;
  if (!records) return [];

  return records
    .map((record) => ({
      id: record.id,
      pet_data: record.pet_data,
      total_played: record.pet_data.times_played.reduce(
        (a: number, b: number) => a + b,
        0
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
