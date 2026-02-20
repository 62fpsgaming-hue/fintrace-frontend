import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase browser client.
 * Returns null if environment variables are not configured
 * (graceful degradation for when auth is not set up).
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not configured. Auth and history features disabled.')
    return null
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
