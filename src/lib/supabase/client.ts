import { createBrowserClient } from '@supabase/supabase-js'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials are not configured. Please provide NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env file.\n\nIMPORTANT: After editing your .env file, you must restart the development server for the changes to take effect.');
  }

  try {
    return createBrowserClient(
      supabaseUrl,
      supabaseKey
    )
  } catch (error) {
    if (error instanceof Error && (error.message.includes('Invalid URL') || error.constructor.name === 'TypeError')) {
      throw new Error(`The Supabase URL provided is invalid. Please check the NEXT_PUBLIC_SUPABASE_URL in your .env file. Value was: "${supabaseUrl}".\n\nIMPORTANT: After editing your .env file, you must restart the development server for the changes to take effect.`);
    }
    throw error;
  }
}
