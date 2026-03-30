import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

// ==================================================
// client with types from Supabase
// - used mainly for the pets and cms schema tables
// ==================================================
export function sbClient<T>() {
  return createBrowserClient<T>(supabaseUrl, supabaseKey);
}

// ==================================================
// client without types from Supabase
// - used mainly for the api schema tables
// ==================================================
export function sbApiClient() {
  return createBrowserClient(supabaseUrl, supabaseKey);
}
