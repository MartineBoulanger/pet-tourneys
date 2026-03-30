'use server';

import { signupsTable } from '@/actions/supabase/actions';
import { Signup } from '@/types/supabase.types';

// =================================================
// Get signups
// =================================================
export async function getSignups(): Promise<{
  success: boolean;
  data?: Signup[];
  error?: string;
}> {
  try {
    const cms = await signupsTable();
    const { data, error } = await cms
      .select('*')
      .order('createdat', { ascending: false });

    if (error)
      return {
        success: false,
        error: error.message || 'Signups not found',
      };

    const processedSignups = data?.map((s) => ({
      id: s.id,
      title: s.title,
      images: s.images as Signup['images'],
      layout: s.layout,
      isvisible: s.isvisible,
      createdat: new Date(s.createdat || '').toLocaleString(),
      updatedat: new Date(s.updatedat || '').toLocaleString(),
    }));

    return {
      success: true,
      data: processedSignups || [],
    };
  } catch (error) {
    console.error('Error fetching signups:', error);
    return { success: false, error: (error as Error).message };
  }
}

// =================================================
// Get signup by visibility
// =================================================
export async function getSignup() {
  try {
    const cms = await signupsTable();
    const { data, error } = await cms
      .select('*')
      .eq('isvisible', true)
      .limit(1)
      .single();

    if (error)
      return {
        success: false,
        error: error.message || 'Visible signup not found',
      };

    const processedSignup = {
      id: data.id,
      title: data.title,
      images: data.images as Signup['images'],
      layout: data.layout,
      isvisible: data.isvisible,
      createdat: new Date(data.createdat || '').toLocaleString(),
      updatedat: new Date(data.updatedat || '').toLocaleString(),
    };

    return {
      success: true,
      data: processedSignup || null,
    };
  } catch (error) {
    console.error('Error fetching signup:', error);
    return { success: false, error: (error as Error).message };
  }
}
