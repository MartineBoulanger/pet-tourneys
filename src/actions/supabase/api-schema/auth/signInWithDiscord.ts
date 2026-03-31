'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { sbServer } from '@/lib/supabase/server';

export const signInWithDiscord = async () => {
  const heads = await headers();
  const origin = heads.get('origin');
  const supabase = await sbServer();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });
  if (error) redirect('/error');
  else if (data.url) redirect(data.url);
};
