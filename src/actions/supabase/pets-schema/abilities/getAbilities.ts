'use server';

import { abilitiesTable } from '@/actions/supabase/actions';
// import { getPetType } from '../families/getFamilies';
import { Ability } from '@/types/supabase.types';

// =================================================
// Get all abilities
// =================================================
export async function getAbilities() {
  try {
    const abs = await abilitiesTable();
    const { data, error } = await abs.select(`*, families(*)`);
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (error) {
    console.error('Get Abilities Error:', error);
    return { success: false, error: (error as Error).message };
  }
}

// =================================================
// Get ability by name
// =================================================
export async function getAbilitiesByNames(names: string[]) {
  try {
    const abs = await abilitiesTable();
    const { data, error } = await abs
      .select(`*, families(*)`)
      .in('name', names);
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (error) {
    console.error('Get Pet Ability Error:', error);
    return { success: false, error: (error as Error).message };
  }
}
