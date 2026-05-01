'use server';

import { apiTable, petsTable } from '@/actions/supabase/actions';
import { PetExtractedData, ExportPet } from '@/types/supabase.types';

export async function getUsedPetsPerLeagueForExport(id: string) {
  const lps = await apiTable('tournament_pet_stats', id);
  const { data: stats, error: statsError } = await lps.select('*');
  if (statsError) return [];

  const extractedPets: PetExtractedData[] = stats
    .map((stat) => ({
      ...stat.pet_data,
      total_played: stat.total_played,
    }))
    .filter(Boolean);

  const uniqueNames = [...new Set(extractedPets.map((p) => p.name))];

  const pets = await petsTable();
  const { data, error } = await pets.select('*').in('name', uniqueNames);
  if (error) throw error;

  const merged: ExportPet[] = extractedPets.map((p) => {
    const db = data?.find((x) => x.name === p.name);

    return {
      id: db?.id ?? -1,
      name: p.name,
      image: db?.image,
      type: db?.type ?? p.type,
      baseStats: {
        health: db?.base_health ?? 0,
        power: db?.base_power ?? 0,
        speed: db?.base_speed ?? 0,
      },
      statsRaw: p.stats,
      breeds: p.breeds,
      totalPlayed: p.total_played ?? 0,
    };
  });

  return merged;
}
