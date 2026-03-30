'use server';

import { resourcesTable } from '@/actions/supabase/actions';
import { Resource } from '@/types/supabase.types';

// =================================================
// Get resources
// =================================================
export async function getResources(): Promise<{
  success: boolean;
  data?: Resource[];
  error?: string;
}> {
  try {
    const cms = await resourcesTable();
    const { data, error } = await cms
      .select('*')
      .order('index', { ascending: true });

    if (error)
      return { success: false, error: error.message || 'Resource not found' };

    const processedResources = data?.map((r) => ({
      id: r.id,
      title: r.title,
      images: r.images as Resource['images'],
      index: r.index,
      createdat: new Date(r.createdat || '').toLocaleString(),
      updatedat: new Date(r.updatedat || '').toLocaleString(),
    }));

    return { success: true, data: processedResources || [] };
  } catch (error) {
    console.error('Error fetching resources:', error);
    return { success: false, error: (error as Error).message };
  }
}

// =================================================
// Get a resource
// =================================================
export async function getResource(id: string) {
  try {
    if (!id) return { success: false, error: 'ID is required' };

    const cms = await resourcesTable();

    const { data, error } = await cms.select('*').eq('id', id).single();

    if (error)
      return { success: false, error: error.message || 'Resource not found' };

    const processedResource = {
      id: data.id,
      title: data.title,
      images: data.images as Resource['images'],
      index: data.index,
      createdat: new Date(data.createdat || '').toLocaleString(),
      updatedat: new Date(data.updatedat || '').toLocaleString(),
    };

    return { success: true, data: processedResource || null };
  } catch (error) {
    console.error('Error fetching resource:', error);
    return { success: false, error: (error as Error).message };
  }
}
