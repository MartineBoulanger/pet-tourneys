'use server';

import { revalidatePath } from 'next/cache';
import { rulesTable } from '@/actions/supabase/actions';
import { Rule } from '@/types/supabase.types';

// =================================================
// Update rule
// =================================================
export async function updateRule(id: string, data: Partial<Rule>) {
  try {
    if (!id) return { success: false, error: 'ID is required' };

    if (!data.title?.trim() || !data.content?.trim())
      return { success: false, error: 'Title and Content are required' };

    const rule = await rulesTable();

    const ruleData = {
      title: data.title.trim(),
      content: data.content.trim(),
      images: data.images,
      index: data.index ?? 1,
      updatedat: new Date().toISOString(),
    };

    const { error } = await rule.update(ruleData).eq('id', id);

    if (error)
      return { success: false, error: error.message || 'Rule not found' };

    revalidatePath('/admin-panel/leagues/rules');

    return { success: true };
  } catch (error) {
    console.error('Error updating rule:', error);
    return { success: false, error: (error as Error).message };
  }
}

// =================================================
// Reorder rules
// =================================================
export async function reorderRules(ids: string[]) {
  try {
    if (!ids || ids.length === 0)
      return { success: false, error: 'IDs are required' };

    const rule = await rulesTable();

    const updates = ids.map((id, index) =>
      rule
        .update({ index: index + 1, updatedat: new Date().toISOString() })
        .eq('id', id),
    );

    const results = await Promise.all(updates);
    const failed = results.find((r) => r.error);

    if (failed?.error) return { success: false, error: failed.error.message };

    revalidatePath('/admin-panel/leagues/rules');

    return { success: true };
  } catch (error) {
    console.error('Error reordering rules:', error);
    return { success: false, error: (error as Error).message };
  }
}
