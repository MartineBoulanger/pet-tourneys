'use server';

import { revalidatePath } from 'next/cache';
import { halloffameTable } from '@/actions/supabase/actions';
import { HallOfFame } from '@/types/supabase.types';

// =================================================
// Create a hall of fame item
// =================================================
export async function createHalloffame(data: Partial<HallOfFame>) {
  try {
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
      season: data.season?.trim(),
      champion: data.champion?.trim(),
      avatar: data.avatar || null,
      region: data.region || 'na',
      runnerup: data.runnerup?.trim(),
      finalsvideourl: data.finalsvideourl?.trim() || null,
      petname: data.petname?.trim() || null,
      petavatar: data.petavatar || null,
      createdat: new Date().toISOString(),
      updatedat: new Date().toISOString(),
    };

    const { data: result, error } = await hof
      .insert(hofData)
      .select('*')
      .single();

    if (error)
      return {
        success: false,
        error: error.message || 'Hall of Fame item not found',
      };

    revalidatePath('/admin-panel/leagues/hall-of-fame');

    return {
      success: true,
      hofItem: {
        id: result?.id || '',
        season: result?.season || hofData.season || '',
        champion: result?.champion || hofData.champion || '',
        avatar: result?.avatar || hofData.avatar || null,
        region: result?.region || hofData.region || 'na',
        runnerup: result?.runnerup || hofData.runnerup || '',
        finalsvideourl: result?.finalsvideourl || hofData.finalsvideourl || '',
        petname: result?.petname || hofData.petname || '',
        petavatar: result?.petavatar || hofData.petavatar || null,
        createdat: new Date(
          result?.createdat || hofData.createdat,
        ).toISOString(),
        updatedat: new Date(
          result?.updatedat || hofData.updatedat,
        ).toISOString(),
      },
    };
  } catch (error) {
    console.error('Error creating hall of fame item:', error);
    return { success: false, error: (error as Error).message };
  }
}
