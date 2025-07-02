import { createBrowserClient, type SupabaseClient } from '@supabase/ssr'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/config';

let client: SupabaseClient | undefined;

export function createClient() {
  if (client) {
    return client;
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[Supabase Client] Initializing new singleton instance...');
    console.log('[Supabase Client] URL:', SUPABASE_URL);
    console.log('[Supabase Client] Key Loaded:', SUPABASE_ANON_KEY.slice(0, 8) + '...');
  }
  
  client = createBrowserClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  return client;
}
