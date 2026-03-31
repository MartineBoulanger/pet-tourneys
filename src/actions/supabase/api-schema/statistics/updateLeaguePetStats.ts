'use server';

import { apiTable } from '@/actions/supabase/actions';
import { LeaguePetData } from '@/types/supabase.types';
import { mergePetData } from '@/utils/supabase/mergePetData';

export async function updateLeaguePetStats(
  id: string,
  newPets: LeaguePetData[],
) {
  const lps = await apiTable('tournament_pet_stats', id);

  // Rest of your update logic...
  const upsertOperations = [];

  for (const newPet of newPets) {
    // Get existing pet record if it exists
    const { data: existingPet } = await lps
      .select('*')
      .eq('pet_data->>name', newPet.pet_data.name)
      .single();

    if (existingPet) {
      // Update existing record
      const updatedPet = {
        ...existingPet,
        pet_data: mergePetData(
          existingPet.pet_data as LeaguePetData['pet_data'],
          newPet.pet_data,
        ),
        total_played: existingPet.total_played + newPet.total_played,
      };

      const res = lps
        .update(updatedPet)
        .eq('id', existingPet.id)
        .select('*')
        .single();

      upsertOperations.push(res);
    } else {
      // Insert new record
      upsertOperations.push(
        lps.insert({
          tournament_id: id,
          pet_data: newPet.pet_data,
          total_played: newPet.total_played,
        }),
      );
    }
  }

  // Execute all operations
  const results = await Promise.all(upsertOperations);
  const errors = results
    .filter((result) => result.error)
    .map((result) => result.error);
  if (errors.length > 0) throw errors[0];
}
