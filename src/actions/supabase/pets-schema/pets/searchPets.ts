'use server';

import { petsTable } from '@/actions/supabase/actions';
import { Pet } from '@/types/supabase.types';

// =================================================
// Search all pets
// =================================================
export const searchPets = async (query: string) => {
  try {
    const pets = await petsTable();
    const { data, error } = await pets
      .select('*')
      .ilike('name', `%${query}%`)
      .order('id', { ascending: true });
    if (error) {
      console.error('Supabase error:', error);
      return { success: false, error: error.message };
    }
    return { success: true, data: (data || []) as Pet[] };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};
