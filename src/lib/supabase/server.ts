import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

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
      // For any other property, return a function that does nothing or returns a promise of nothing.
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
  const cookieStore = cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL' || !supabaseKey || supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
    if (process.env.NODE_ENV === 'development') {
        console.warn(`
        --------------------------------------------------
        [AidSync Config Warning]
        Supabase credentials are not configured.
        Authentication and database features will be disabled.
        
        Please provide these in your root .env file:
        NEXT_PUBLIC_SUPABASE_URL=...
        NEXT_PUBLIC_SUPABASE_ANON_KEY=...

        Remember to restart your dev server after updating.
        --------------------------------------------------
        `);
    }
    return createMockClient();
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[Supabase Server] Initialized with URL:', supabaseUrl);
    console.log('[Supabase Server] Key Loaded:', supabaseKey.slice(0, 8) + '...');
  }

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
          }
        },
      },
    }
  )
}
