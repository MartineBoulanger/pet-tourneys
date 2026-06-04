'use server';

import { abilitiesTable } from '@/actions/supabase/actions';

// =================================================
// Get abilities per pet by pet name
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
