'use server';

import { revalidatePath } from 'next/cache';
import { rulesTable } from '@/actions/supabase/actions';
import { Rule } from '@/types/supabase.types';

// =================================================
// Create rule
// =================================================
export async function createRule(data: Partial<Rule>) {
  try {
    if (!data.title?.trim() || !data.content?.trim())
      return { success: false, error: 'Title and Content are required' };

    const rule = await rulesTable();

    const { data: highest } = await rule
      .select('index')
      .order('index', { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextIndex = highest ? highest.index + 1 : 1;

    const ruleData = {
      title: data.title.trim(),
      content: data.content.trim(),
      images: data.images,
      index: nextIndex,
      createdat: new Date().toISOString(),
      updatedat: new Date().toISOString(),
    };

    const { data: result, error } = await rule
      .insert(ruleData)
      .select('*')
      .single();

    if (error)
      return { success: false, error: error.message || 'Rule not found' };

    revalidatePath('/admin-panel/leagues/rules');

    return {
      success: true,
      rule: {
        id: result?.id || '',
        title: result?.title || ruleData.title || '',
        content: result?.content || ruleData.content || '',
        images: result?.images || ruleData.images || [],
        index: result?.index || ruleData.index || 1,
        createdat: new Date(
          result?.createdat || ruleData.createdat,
        ).toISOString(),
        updatedat: new Date(
          result?.updatedat || ruleData.updatedat,
        ).toISOString(),
      },
    };
  } catch (error) {
    console.error('Error creating rule:', error);
    return { success: false, error: (error as Error).message };
  }
}
