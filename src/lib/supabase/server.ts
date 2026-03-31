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
  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: await getCookieHandler(),
    },
  );
}
