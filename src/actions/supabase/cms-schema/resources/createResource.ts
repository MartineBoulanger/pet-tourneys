'use server';

import { revalidatePath } from 'next/cache';
import { resourcesTable } from '@/actions/supabase/actions';
import { Resource } from '@/types/supabase.types';

// =================================================
// Create resource
// =================================================
export async function createResource(data: Partial<Resource>) {
  try {
    if (!data.title?.trim())
      return { success: false, error: 'Title is required' };

    if (!data.images || data.images.length === 0)
      return { success: false, error: 'At least one image is required' };

    const cms = await resourcesTable();

    // get the highest index to decide the ordering
    const { data: highest } = await cms
      .select('index')
      .order('index', { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextIndex = highest ? highest.index + 1 : 1;

    const resourceData = {
      title: data.title.trim(),
      images: data.images,
      index: nextIndex,
      createdat: new Date().toISOString(),
      updatedat: new Date().toISOString(),
    };

    const { data: result, error } = await cms
      .insert(resourceData)
      .select('*')
      .single();

    if (error)
      return {
        success: false,
        error: error.message || 'Resource not created',
      };

    revalidatePath('/admin-panel/content/resources');

    return {
      success: true,
      resource: {
        id: result?.id || '',
        title: result?.title || resourceData.title || '',
        images: result?.images || resourceData.images || [],
        index: result?.index || resourceData.index || 1,
        createdat: new Date(
          result?.createdat || resourceData.createdat,
        ).toISOString(),
        updatedat: new Date(
          result?.updatedat || resourceData.updatedat,
        ).toISOString(),
      },
    };
  } catch (error) {
    console.error('Error creating resource:', error);
    return { success: false, error: (error as Error).message };
  }
}
