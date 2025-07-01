import { createBrowserClient } from '@supabase/ssr'

// A mock client to be used when Supabase is not configured.
const createMockClient = () => {
    const handler = {
      get(target: any, prop: string) {
        if (prop === 'auth') {
          return {
            getUser: async () => ({ data: { user: null }, error: null }),
            getSession: async () => ({ data: { session: null }, error: null }),
            signInWithPassword: async () => ({ data: { user: null }, error: { name: 'MissingSupabaseConfigError', message: 'Authentication is not configured.' } }),
            signUp: async () => ({ data: { user: null }, error: { name: 'MissingSupabaseConfigError', message: 'Authentication is not configured.' } }),
            signOut: async () => ({ error: null }),
            exchangeCodeForSession: async () => ({ data: { session: null }, error: { name: 'MissingSupabaseConfigError', message: 'Authentication is not configured.' } }),
          };
        }
        return () => ({
          from: () => ({
            select: () => Promise.resolve({ data: [], error: { message: 'Supabase not configured' } }),
            insert: () => Promise.resolve({ data: [], error: { message: 'Supabase not configured' } }),
            update: () => Promise.resolve({ data: [], error: { message: 'Supabase not configured' } }),
            delete: () => Promise.resolve({ data: [], error: { message: 'Supabase not configured' } }),
          }),
        });
      }
    };
    return new Proxy({}, handler);
};

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL' || !supabaseKey || supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
    // We don't log the big warning here to avoid spamming the browser console.
    // The server-side warning is sufficient.
    return createMockClient();
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[Supabase Client] Initialized with URL:', supabaseUrl);
    console.log('[Supabase Client] Key Loaded:', supabaseKey.slice(0, 8) + '...');
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseKey
  )
}
