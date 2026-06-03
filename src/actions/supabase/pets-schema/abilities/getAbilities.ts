'use server';

import { abilitiesTable } from '@/actions/supabase/actions';
import { Ability } from '@/types/supabase.types';

// =================================================
// Get all abilities
// =================================================
export async function getAbilities() {
  try {
    const abs = await abilitiesTable();
    const { data, error } = await abs.select('*');
    if (error) return { success: false, error: error.message };
    return { success: true, data: data as Ability[] };
  } catch (error) {
    console.error('Get Abilities Error:', error);
    return { success: false, error: (error as Error).message };
  }
}

// =================================================
// Get ability by name
// =================================================
export async function getAbilityByName(name: string) {
  try {
    const abs = await abilitiesTable();
    const { data, error } = await abs.select('*').eq('name', name).single();
    if (error) return { success: false, error: error.message };
    return { success: true, data: data as Ability };
  } catch (error) {
    console.error('Get Pet Ability Error:', error);
    return { success: false, error: (error as Error).message };
  }
}
