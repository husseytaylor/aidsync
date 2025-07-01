import { createBrowserClient } from '@supabase/ssr'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/config';

export function createClient() {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Supabase Client] Initialized with URL:', SUPABASE_URL);
    console.log('[Supabase Client] Key Loaded:', SUPABASE_ANON_KEY.slice(0, 8) + '...');
  }

  return createBrowserClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  )
}
