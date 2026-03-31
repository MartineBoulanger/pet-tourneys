import { createBrowserClient } from '@supabase/ssr';

// ==================================================
// client with types from Supabase
// - used mainly for the pets and cms schema tables
// ==================================================
export function sbClient<T>() {
  return createBrowserClient<T>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

// ==================================================
// client without types from Supabase
// - used mainly for the api schema tables
// ==================================================
export function sbApiClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
