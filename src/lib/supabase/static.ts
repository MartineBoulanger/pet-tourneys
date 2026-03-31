'use server';

import { createServerClient } from '@supabase/ssr';

// ==================================================
// server client with types from Supabase
// - used mainly for the pets and cms schema tables
// ==================================================
export async function sbStatic<T>() {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_ANON_KEY!;
  return createServerClient<T>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => [],
      setAll: () => {},
    },
  });
}

// ==================================================
// sever client without types from Supabase
// - used mainly for the api schema tables
// ==================================================
export async function sbApiStatic() {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_ANON_KEY!;
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => [],
      setAll: () => {},
    },
  });
}
