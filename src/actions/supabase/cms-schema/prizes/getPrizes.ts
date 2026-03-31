'use server';

import { prizesTable } from '@/actions/supabase/actions';
import { Prize } from '@/types/supabase.types';

// =================================================
// Get prizes
// =================================================
export async function getPrizes(): Promise<{
  success: boolean;
  data?: Prize[];
  error?: string;
}> {
  try {
    const prize = await prizesTable();

    const { data, error } = await prize
      .select('*')
      .order('index', { ascending: true });

    if (error)
      return { success: false, error: error.message || 'Prize not found' };

    const processedPrizes = data?.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      iscarousel: p.iscarousel,
      iscolumnlayout: p.iscolumnlayout,
      imageposition: p.imageposition,
      textalignment: p.textalignment,
      images: p.images as Prize['images'],
      videourl: p.videourl,
      index: p.index,
      createdat: new Date(p.createdat || '').toLocaleString(),
      updatedat: new Date(p.updatedat || '').toLocaleString(),
    }));

    return { success: true, data: processedPrizes || [] };
  } catch (error) {
    console.error('Error fetching prizes:', error);
    return { success: false, error: (error as Error).message };
  }
}

// =================================================
// Get a prize
// =================================================
export async function getPrize(id: string) {
  try {
    if (!id) return { success: false, error: 'ID is required' };

    const cms = await prizesTable();

    const { data, error } = await cms.select('*').eq('id', id).single();

    if (error)
      return { success: false, error: error.message || 'Prize not found' };

    const processedPrize = {
      id: data.id,
      title: data.title,
      description: data.description,
      iscarousel: data.iscarousel,
      iscolumnlayout: data.iscolumnlayout,
      imageposition: data.imageposition,
      textalignment: data.textalignment,
      images: data.images as Prize['images'],
      videourl: data.videourl,
      index: data.index,
      createdat: new Date(data.createdat || '').toLocaleString(),
      updatedat: new Date(data.updatedat || '').toLocaleString(),
    };

    return { success: true, data: processedPrize || null };
  } catch (error) {
    console.error('Error fetching prize:', error);
    return { success: false, error: (error as Error).message };
  }
}
