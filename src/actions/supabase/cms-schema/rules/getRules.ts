'use server';

import { rulesTable } from '@/actions/supabase/actions';
import { Rule } from '@/types/supabase.types';

// =================================================
// Get prizes
// =================================================
export async function getRules(): Promise<{
  success: boolean;
  data?: Rule[];
  error?: string;
}> {
  try {
    const rule = await rulesTable();

    const { data, error } = await rule
      .select('*')
      .order('index', { ascending: true });

    if (error)
      return { success: false, error: error.message || 'Rule not found' };

    const processedRules = data?.map((r) => ({
      id: r.id,
      title: r.title,
      content: r.content,
      images: r.images as Rule['images'],
      index: r.index,
      createdat: new Date(r.createdat || '').toLocaleString(),
      updatedat: new Date(r.updatedat || '').toLocaleString(),
    }));

    return { success: true, data: processedRules || [] };
  } catch (error) {
    console.error('Error fetching rules:', error);
    return { success: false, error: (error as Error).message };
  }
}

// =================================================
// Get a prize
// =================================================
export async function getRule(id: string) {
  try {
    if (!id) return { success: false, error: 'ID is required' };

    const cms = await rulesTable();

    const { data, error } = await cms.select('*').eq('id', id).single();

    if (error)
      return { success: false, error: error.message || 'Rule not found' };

    const processedRule = {
      id: data.id,
      title: data.title,
      content: data.content,
      images: data.images as Rule['images'],
      index: data.index,
      createdat: new Date(data.createdat || '').toLocaleString(),
      updatedat: new Date(data.updatedat || '').toLocaleString(),
    };

    return { success: true, data: processedRule || null };
  } catch (error) {
    console.error('Error fetching rule:', error);
    return { success: false, error: (error as Error).message };
  }
}
