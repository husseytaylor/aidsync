import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseUrl.startsWith('https://')) {
    throw new Error('[Supabase Config Error] Invalid or missing NEXT_PUBLIC_SUPABASE_URL. Please check your .env file and restart the dev server.');
  }

  if (!supabaseKey || supabaseKey.length < 20) {
    throw new Error('[Supabase Config Error] Invalid or missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Please check your .env file and restart the dev server.');
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[Supabase Client] URL:', supabaseUrl);
    console.log('[Supabase Client] Key Loaded:', supabaseKey.slice(0, 8) + '...');
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseKey
  )
}
