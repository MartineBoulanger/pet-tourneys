import { createBrowserClient } from '@supabase/ssr';
// import { Database } from '@/types/database.types';

export function createClient() {
  const client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Set the schema for all queries from this client
  return client;
}
