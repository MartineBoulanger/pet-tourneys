'use server';

import { revalidatePath } from 'next/cache';
import { prizesTable } from '@/actions/supabase/actions';
import { Prize } from '@/types/supabase.types';

// =================================================
// Create prize
// =================================================
export async function createPrize(data: Partial<Prize>) {
  try {
    if (!data.title?.trim() || !data.description?.trim())
      return { success: false, error: 'Title and Description are required' };

    const prize = await prizesTable();

    const { data: highest } = await prize
      .select('index')
      .order('index', { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextIndex = highest ? highest.index + 1 : 1;

    const prizeData = {
      title: data.title.trim(),
      description: data.description.trim(),
      iscarousel: data.iscarousel,
      iscolumnlayout: data.iscolumnlayout,
      imageposition: data.imageposition,
      textalignment: data.textalignment,
      images: data.images,
      videourl: data.videourl,
      index: nextIndex,
      createdat: new Date().toISOString(),
      updatedat: new Date().toISOString(),
    };

    const { data: result, error } = await prize
      .insert(prizeData)
      .select('*')
      .single();

    if (error)
      return { success: false, error: error.message || 'Prize not created' };

    revalidatePath('/admin-panel/leagues/prizes');

    return {
      success: true,
      prize: {
        id: result?.id || '',
        title: result?.title || prizeData.title || '',
        description: result?.description || prizeData.description || '',
        iscarousel: result?.iscarousel ?? prizeData.iscarousel ?? false,
        iscolumnlayout:
          result?.iscolumnlayout ?? prizeData.iscolumnlayout ?? false,
        imageposition: result?.imageposition || prizeData.imageposition || '',
        textalignment:
          result?.textalignment || prizeData.textalignment || 'left',
        images: result?.images || prizeData.images || [],
        videourl: result?.videourl || prizeData.videourl || '',
        index: result?.index || prizeData.index || 1,
        createdat: new Date(
          result?.createdat || prizeData.createdat,
        ).toISOString(),
        updatedat: new Date(
          result?.updatedat || prizeData.updatedat,
        ).toISOString(),
      },
    };
  } catch (error) {
    console.error('Error creating prize:', error);
    return { success: false, error: (error as Error).message };
  }
}
