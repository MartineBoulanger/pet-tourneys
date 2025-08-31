'use server';

import { createClient } from '../server';
import { getTournamentTableName } from '../utils/getTournamentTableName';
import { TournamentPetStat } from '../types';

export async function getTournamentPetStats(
  tournamentId: string
): Promise<TournamentPetStat[]> {
  const supabase = await createClient();
  const petUsageTable = getTournamentTableName('pet_usage', tournamentId);
  const matchesTable = getTournamentTableName('matches', tournamentId);
  const battleLogsTable = getTournamentTableName('battle_logs', tournamentId);

  // Get all necessary data
  const { data: matches } = await supabase
    .schema('api')
    .from(matchesTable)
    .select('id, player1, player2');

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

  // First pass: process all battle logs to track pet participation and outcomes
  const petBattleStats = new Map<
    string,
    {
      totalBattles: number;
      wins: number;
      losses: number;
      matchesParticipated: Set<string>;
    }
  >();

  for (const battleLog of allBattleLogs) {
    const battleResult = battleLog.result;
    const playerTeam = battleLog.player_team || [];
    const opponentTeam = battleLog.opponent_team || [];

    // Process all pets in this battle
    const allPets = [...new Set([...playerTeam, ...opponentTeam])];
    for (const petName of allPets) {
      if (!petBattleStats.has(petName)) {
        petBattleStats.set(petName, {
          totalBattles: 0,
          wins: 0,
          losses: 0,
          matchesParticipated: new Set(),
        });
      }
      const stats = petBattleStats.get(petName)!;
      stats.matchesParticipated.add(battleLog.match_id);

      const isPlayerPet = playerTeam.includes(petName);
      const isOpponentPet = opponentTeam.includes(petName);
      const isBoth = isPlayerPet && isOpponentPet;

      if (isBoth || battleResult === 'DRAW') {
        stats.totalBattles += 0;
      } else if (isPlayerPet) {
        stats.totalBattles += 1;
        if (battleResult === 'WIN') stats.wins += 1;
        else stats.losses += 1;
      } else if (isOpponentPet) {
        stats.totalBattles += 1;
        if (battleResult === 'WIN') stats.losses += 1;
        else stats.wins += 1;
      }
    }
  }

  // Second pass: process pet usage records and combine with battle stats
  for (const record of records) {
    const battleStats = petBattleStats.get(record.pet_data.name);
    if (!battleStats) continue;

    const existing = petMap.get(record.pet_data.name);
    const totalBattles = battleStats.totalBattles;
    const winRate = totalBattles > 0 ? battleStats.wins / totalBattles : 0;

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
          existingBreed.wins! += Math.round(battleStats.wins * breedRatio);
          existingBreed.losses! += Math.round(battleStats.losses * breedRatio);
          if (record.pet_data.stats[i]) {
            existingBreed.stats = record.pet_data.stats[i];
          }
        } else {
          existing.breed_stats.push({
            breed,
            stats: record.pet_data.stats[i] || '',
            times_played: breedPlayCount,
            wins: Math.round(battleStats.wins * breedRatio),
            losses: Math.round(battleStats.losses * breedRatio),
          });
        }
      });

      // Update totals
      existing.total_played += record.total_played;
      existing.wins = battleStats.wins;
      existing.losses = battleStats.losses;
      existing.match_count = battleStats.matchesParticipated.size;
    } else {
      // Create new entry
      petMap.set(record.pet_data.name, {
        id: record.id,
        pet_data: {
          ...record.pet_data,
          wins: battleStats.wins,
          losses: battleStats.losses,
        },
        total_played: record.total_played,
        breed_stats: record.pet_data.breeds.map((breed: string, i: number) => {
          const breedPlayCount = record.pet_data.times_played[i] || 0;
          const breedRatio = breedPlayCount / record.total_played;
          return {
            breed,
            stats: record.pet_data.stats[i] || '',
            times_played: breedPlayCount,
            wins: Math.round(battleStats.wins * breedRatio),
            losses: Math.round(battleStats.losses * breedRatio),
          };
        }),
        wins: battleStats.wins,
        losses: battleStats.losses,
        win_rate: winRate,
        match_count: battleStats.matchesParticipated.size,
      });
    }
  }

  // Final processing with win rates
  return Array.from(petMap.values())
    .map((pet) => {
      const totalGames = (pet.wins || 0) + (pet.losses || 0);
      const winRate =
        totalGames > 0 ? Math.round((pet.wins! / totalGames) * 100) : 0;

      return {
        ...pet,
        win_rate: winRate,
        w_l: `${pet.wins || 0}/${pet.losses || 0}`,
      };
    })
    .sort((a, b) => b.total_played - a.total_played);
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
