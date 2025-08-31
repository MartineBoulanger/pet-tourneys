'use server';

import { createClient } from '../server';
import { parseBattleLog } from '../utils/battleLogParser';
import { parsePetUsage } from '../utils/petUsageParser';
import { getTournamentTableName } from '../utils/getTournamentTableName';
import { UploadProps, PetData, PetUsageData } from '../types';

export async function uploadBattleLog(props: UploadProps) {
  const supabase = await createClient();
  const { logs, petUsage, tournament_id, region, ...matchData } = props;
  const matchesTable = getTournamentTableName('matches', tournament_id);
  const battleLogsTable = getTournamentTableName('battle_logs', tournament_id);
  const petUsageTable = getTournamentTableName('pet_usage', tournament_id);

  try {
    // Validate
    if (!logs || !petUsage)
      throw new Error('Battle log and pet usage are required');

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
      { owner: 0, opponent: 0 }
    );

    const outcome =
      scores.owner > scores.opponent
        ? 'WIN'
        : scores.opponent > scores.owner
        ? 'LOSS'
        : 'DRAW';

    // Create match record
    const { data: match, error: matchError } = await supabase
      .schema('api')
      .from(matchesTable)
      .insert({
        ...matchData,
        region,
        owner_score: scores.owner,
        opponent_score: scores.opponent,
        outcome,
      })
      .select()
      .single();

    if (matchError) throw matchError;
    if (!match?.id) throw new Error('Failed to create match - no ID returned');

    // Insert battle logs
    const { error: logError } = await supabase
      .schema('api')
      .from(battleLogsTable)
      .insert(
        battleLogs.map((log) => ({
          ...log,
          match_id: match.id,
        }))
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

    const { error: petUsageError } = await supabase
      .schema('api')
      .from(petUsageTable)
      .insert(matchPetUsages);

    if (petUsageError) throw petUsageError;

    await updateTournamentPetStats(tournament_id, parsedPets);

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

export async function updateTournamentPetStats(
  tournament_id: string,
  newPets: PetData[]
) {
  const supabase = await createClient();
  const aggregatedTable = getTournamentTableName(
    'tournament_pet_stats',
    tournament_id
  );

  // Rest of your update logic...
  const upsertOperations = [];

  for (const newPet of newPets) {
    // Get existing pet record if it exists
    const { data: existingPet } = await supabase
      .schema('api')
      .from(aggregatedTable)
      .select('*')
      .eq('pet_data->>name', newPet.pet_data.name)
      .single();

    if (existingPet) {
      // Update existing record
      const updatedPet = {
        ...existingPet,
        pet_data: mergePetData(existingPet.pet_data, newPet.pet_data),
        total_played: existingPet.total_played + newPet.total_played,
      };
      upsertOperations.push(
        supabase
          .schema('api')
          .from(aggregatedTable)
          .update(updatedPet)
          .eq('id', existingPet.id)
      );
    } else {
      // Insert new record
      upsertOperations.push(
        supabase.schema('api').from(aggregatedTable).insert({
          tournament_id,
          pet_data: newPet.pet_data,
          total_played: newPet.total_played,
        })
      );
    }
  }

  // Execute all operations
  const results = await Promise.all(upsertOperations);
  const errors = results.filter((r) => r.error).map((r) => r.error);
  if (errors.length > 0) throw errors[0];
}

function mergePetData(existing: PetUsageData, newData: PetUsageData) {
  return {
    name: existing.name,
    type: existing.type,
    stats: [...new Set([...existing.stats, ...newData.stats])],
    breeds: [...new Set([...existing.breeds, ...newData.breeds])],
    times_played: mergeBreedPlayCounts(
      existing.breeds,
      existing.times_played,
      newData.breeds,
      newData.times_played
    ),
  };
}

function mergeBreedPlayCounts(
  existingBreeds: string[],
  existingCounts: number[],
  newBreeds: string[],
  newCounts: number[]
) {
  const mergedBreeds = [...new Set([...existingBreeds, ...newBreeds])];
  const mergedCounts = new Array(mergedBreeds.length).fill(0);

  // Add existing counts
  existingBreeds.forEach((breed, index) => {
    const mergedIndex = mergedBreeds.indexOf(breed);
    mergedCounts[mergedIndex] += existingCounts[index];
  });

  // Add new counts
  newBreeds.forEach((breed, index) => {
    const mergedIndex = mergedBreeds.indexOf(breed);
    mergedCounts[mergedIndex] += newCounts[index];
  });

  return mergedCounts;
}
