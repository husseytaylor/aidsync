import { createBrowserClient } from '@supabase/ssr'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/config';

// It's crucial to NOT use a singleton pattern here.
// Creating a new client on every call ensures that the client-side
// instance always has the most up-to-date session information from cookies.
// A cached client can lead to stale session data and authentication issues.
export function createClient() {
  return createBrowserClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );
}
