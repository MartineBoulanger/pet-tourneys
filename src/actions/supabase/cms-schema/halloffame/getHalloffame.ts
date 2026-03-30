'use server';

import { halloffameTable } from '@/actions/supabase/actions';
import { HallOfFame } from '@/types/supabase.types';

// =================================================
// Get all hall of fame items
// =================================================
export async function getHalloffame(): Promise<{
  success: boolean;
  data?: HallOfFame[];
  error?: string;
}> {
  try {
    const hof = await halloffameTable();

    const { data, error } = await hof
      .select('*')
      .order('createdat', { ascending: false });

    if (error)
      return {
        success: false,
        error: error.message || 'Hall of Fame item not found',
      };

    const processedData = data?.map((h) => ({
      id: h.id,
      season: h.season,
      champion: h.champion,
      avatar: h.avatar as HallOfFame['avatar'],
      region: h.region,
      runnerup: h.runnerup,
      finalsvideourl: h.finalsvideourl,
      petname: h.petname,
      petavatar: h.petavatar as HallOfFame['petavatar'],
      createdat: new Date(h.createdat || '').toLocaleString(),
      updatedat: new Date(h.updatedat || '').toLocaleString(),
    }));

    return { success: true, data: processedData || [] };
  } catch (error) {
    console.error('Error fetching hall of fame:', error);
    return { success: false, error: (error as Error).message };
  }
}

// =================================================
// Get latest hall of fame item
// =================================================
export async function getLatestHalloffame(): Promise<{
  success: boolean;
  data?: HallOfFame;
  error?: string;
}> {
  try {
    const hof = await halloffameTable();

    const { data, error } = await hof
      .select('*')
      .order('createdat', { ascending: false })
      .limit(1)
      .single();

    if (error)
      return {
        success: false,
        error: error.message || 'Hall of fame item not found',
      };

    const processedData = {
      id: data.id,
      season: data.season,
      champion: data.champion,
      avatar: data.avatar as HallOfFame['avatar'],
      region: data.region,
      runnerup: data.runnerup,
      finalsvideourl: data.finalsvideourl,
      petname: data.petname,
      petavatar: data.petavatar as HallOfFame['petavatar'],
      createdat: new Date(data.createdat || '').toLocaleString(),
      updatedat: new Date(data.updatedat || '').toLocaleString(),
    };

    return { success: true, data: processedData || null };
  } catch (error) {
    console.error('Error fetching latest hall of fame item:', error);
    return { success: false, error: (error as Error).message };
  }
}
