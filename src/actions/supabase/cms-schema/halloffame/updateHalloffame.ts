'use server';

import { revalidatePath } from 'next/cache';
import { halloffameTable } from '@/actions/supabase/actions';
import { HallOfFame } from '@/types/supabase.types';

// =================================================
// Update a hall of fame item
// =================================================
export async function updateHalloffame(id: string, data: Partial<HallOfFame>) {
  try {
    if (!id) return { success: false, error: 'ID is required' };

    if (
      !data.champion?.trim() ||
      !data.season?.trim() ||
      !data.runnerup?.trim()
    )
      return {
        success: false,
        error: 'Season, Champion name, and Runner-up name are required.',
      };

    const hof = await halloffameTable();

    const hofData = {
      season: data.season,
      champion: data.champion,
      avatar: data.avatar,
      region: data.region,
      runnerup: data.runnerup,
      finalsvideourl: data.finalsvideourl,
      petname: data.petname,
      petavatar: data.petavatar,
      updatedat: new Date().toISOString(),
    };

    const { error } = await hof.update(hofData).eq('id', id);

    if (error)
      return {
        success: false,
        error: error.message || 'Hall of Fame item not found',
      };

    revalidatePath('/admin-panel/leagues/hall-of-fame');

    return { success: true };
  } catch (error) {
    console.error('Error updating hall of fame item:', error);
    return { success: false, error: (error as Error).message };
  }
}
