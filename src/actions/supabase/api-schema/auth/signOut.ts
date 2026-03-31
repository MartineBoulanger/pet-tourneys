'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { sbServer } from '@/lib/supabase/server';

export const signOut = async () => {
  const supabase = await sbServer();
  const { error } = await supabase.auth.signOut();
  if (error) redirect('/error');
  revalidatePath('/', 'layout');
  redirect('/');
};
