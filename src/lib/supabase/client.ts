import { createBrowserClient } from '@supabase/ssr';

// ==================================================
// client with types from Supabase
// - used mainly for the pets and cms schema tables
// ==================================================
export function sbClient<T>() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createBrowserClient<T>(supabaseUrl, supabaseKey);
}

// ==================================================
// client without types from Supabase
// - used mainly for the api schema tables
// ==================================================
export function sbApiClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createBrowserClient(supabaseUrl, supabaseKey);
}
