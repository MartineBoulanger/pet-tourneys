'use server';

import { sbServer } from '@/lib/supabase/server';
import { getUser } from '@/actions/supabase/auth-actions';
import { SCHEMA } from '@/types/supabase.types';

export const getUserSession = async () => {
  try {
    const { data, error } = await getUser();
    if (error) return null;
    const sb = await sbServer();
    const { data: user, error: userError } = await sb
      .schema(SCHEMA.API)
      .from('profiles')
      .select('*')
      .eq('id', data?.user.id)
      .limit(1)
      .single();
    if (userError) return null;
    return { status: 'success', user };
  } catch (error) {
    console.error('Error in getUserSession:', error);
    return null;
  }
};
