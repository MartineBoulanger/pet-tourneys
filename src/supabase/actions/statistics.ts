'use server';

import { createClient } from '@/supabase/server';
import { getTournamentTableName } from '@/utils/getTournamentTableName';
import { TournamentPetStat } from '@/types';

export async function getTournamentPetStats(
  tournamentId: string
): Promise<TournamentPetStat[]> {
  const supabase = await createClient();
  const petUsageTable = getTournamentTableName('pet_usage', tournamentId);
  const matchesTable = getTournamentTableName('matches', tournamentId);
  const battleLogsTable = getTournamentTableName('battle_logs', tournamentId);

  // Get all necessary data in one go
  const { data: matches } = await supabase
    .schema('api')
    .from(matchesTable)
    .select('id, player1, player2, outcome');

  // Only use aggregated records for tournament view
  const { data: records, error } = await supabase
    .schema('api')
    .from(petUsageTable)
    .select('*');

  const { data: allBattleLogs, error: battleLogsError } = await supabase
    .schema('api')
    .from(battleLogsTable)
    .select('*');

  if (error || battleLogsError) throw error || battleLogsError;
  if (!records || !allBattleLogs || !matches) return [];

  const petMap = new Map<string, TournamentPetStat>();

  for (const record of records) {
    const match = matches.find((m) => m.id === record.match_id);
    const battleLog = allBattleLogs.find(
      (bl) => bl.match_id === record.match_id
    );

    if (!match || !battleLog) continue;

    const isPlayerPet = battleLog.player_team?.includes(record.pet_data.name);
    const isOpponentPet = battleLog.opponent_team?.includes(
      record.pet_data.name
    );
    const isSamePetOnBothTeams = isPlayerPet && isOpponentPet;

    // Calculate wins and losses for this record
    let wins = 0;
    let losses = 0;

    if (isSamePetOnBothTeams) {
      // Split 50/50 if pet appears on both teams
      wins = match.outcome === 'WIN' ? 0.5 * record.total_played : 0;
      losses = match.outcome === 'LOSS' ? 0.5 * record.total_played : 0;
    } else if (isPlayerPet) {
      // Player pet - normal win/loss assignment
      wins = match.outcome === 'WIN' ? record.total_played : 0;
      losses = match.outcome === 'LOSS' ? record.total_played : 0;
    } else if (isOpponentPet) {
      // Opponent pet - reverse win/loss assignment
      wins = match.outcome === 'LOSS' ? record.total_played : 0;
      losses = match.outcome === 'WIN' ? record.total_played : 0;
    }

    const existing = petMap.get(record.pet_data.name);

    if (existing) {
      // Merge with existing record
      record.pet_data.breeds.forEach((breed: string, i: number) => {
        const existingBreed = existing.breed_stats.find(
          (bs) => bs.breed === breed
        );
        const breedPlayCount = record.pet_data.times_played[i] || 0;
        const breedRatio = breedPlayCount / record.total_played;
        if (existingBreed) {
          existingBreed.times_played += breedPlayCount;
          existingBreed.wins! += wins * breedRatio;
          existingBreed.losses! += losses * breedRatio;
          if (record.pet_data.stats[i]) {
            existingBreed.stats = record.pet_data.stats[i];
          }
        } else {
          existing.breed_stats.push({
            breed,
            stats: record.pet_data.stats[i] || '',
            times_played: breedPlayCount,
            wins: wins * breedRatio,
            losses: losses * breedRatio,
          });
        }
      });

      // Update totals
      existing.total_played += record.total_played;
      existing.wins! += wins;
      existing.losses! += losses;
      existing.match_count += 1;
    } else {
      // Create new entry with win/loss stats
      petMap.set(record.pet_data.name, {
        id: record.id,
        pet_data: {
          ...record.pet_data,
          wins,
          losses,
        },
        total_played: record.total_played,
        breed_stats: record.pet_data.breeds.map((breed: string, i: number) => {
          const breedPlayCount = record.pet_data.times_played[i] || 0;
          const breedRatio = breedPlayCount / record.total_played;
          return {
            breed,
            stats: record.pet_data.stats[i] || '',
            times_played: breedPlayCount,
            wins: wins * breedRatio,
            losses: losses * breedRatio,
          };
        }),
        wins,
        losses,
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
