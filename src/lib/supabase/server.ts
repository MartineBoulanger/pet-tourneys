'use server';

import { createServerClient, CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

const getCookieHandler = async () => {
  const cookieStore = await cookies();
  return {
    getAll() {
      return cookieStore.getAll();
    },
    setAll(
      cookies: {
        name: string;
        value: string;
        options: CookieOptions;
      }[],
    ) {
      try {
        cookies.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options),
        );
      } catch {}
    },
  };
};

// ==================================================
// server client for the authentication handling
// ==================================================
export async function sbServer() {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_ANON_KEY!;
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: await getCookieHandler(),
  });
}
