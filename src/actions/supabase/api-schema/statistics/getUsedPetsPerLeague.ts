'use server';

import { apiTable, petsTable } from '@/actions/supabase/actions';
import { PetExtractedData, ExportPet, Pet } from '@/types/supabase.types';

export async function getUsedPetsPerLeagueForExport(id: string) {
  try {
    const lps = await apiTable('tournament_pet_stats', id);
    const { data: stats, error: statsError } = await lps.select('*');
    if (statsError) return { error: statsError.message };

    const extractedPets: PetExtractedData[] = stats
      .map((stat) => ({
        ...stat.pet_data,
        total_played: stat.total_played,
      }))
      .filter(Boolean);

    const uniqueNames = [...new Set(extractedPets.map((p) => p.name))];

    const pets = await petsTable();
    const pageSize = 1000;
    let allData: Pet[] = [];
    let from = 0;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await pets
        .select('*')
        .in('name', uniqueNames)
        .range(from, from + pageSize - 1);

      if (error) {
        console.error('Supabase error:', error);
        return { error: error.message };
      }

      allData = [...allData, ...(data as Pet[])];
      hasMore = data.length === pageSize;
      from += pageSize;
    }

    const merged: ExportPet[] = extractedPets.map((p) => {
      const db = allData?.find((x) => x.name === p.name);

      return {
        id: db?.id ?? -1,
        name: p.name,
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

    return { data: merged };
  } catch (error) {
    return { error: (error as Error).message };
  }
}
