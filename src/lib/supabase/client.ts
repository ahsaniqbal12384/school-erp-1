import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client singleton
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

// For client components - returns the singleton
export const createClient = () => supabase

// Alias for createClient
export const createBrowserClient = createClient

// Server-side Supabase client with service role (for admin operations)
export const createServerClient = () => {
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}

export default supabase
