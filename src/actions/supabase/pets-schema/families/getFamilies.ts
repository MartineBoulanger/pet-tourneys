'use server';

import { familiesTable } from '@/actions/supabase/actions';
import { PetType, Family } from '@/types/supabase.types';

// =================================================
// Get pet type per type
// =================================================
export async function getPetType(type: PetType) {
  try {
    const types = await familiesTable();
    const { data, error } = await types.select('*').eq('type', type).single();
    if (error) return { success: false, error: error.message };
    return { success: true, data: data as Family };
  } catch (error) {
    console.error('Get Pet Type Error:', error);
    return { success: false, error: (error as Error).message };
  }
}

// =================================================
// Get all pet types
// =================================================
export async function getPetTypes() {
  try {
    const types = await familiesTable();
    const { data, error } = await types.select('*');
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (error) {
    console.error('Get Pet Types Error:', error);
    return { success: false, error: (error as Error).message };
  }
}
