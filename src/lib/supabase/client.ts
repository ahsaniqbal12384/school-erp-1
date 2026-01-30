import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Safely get environment variables with fallback for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Client-side Supabase client singleton
// Initialize lazily to handle build-time when env vars might not be available
let supabaseInstance: any = null

const initSupabase = () => {
    if (!supabaseInstance) {
        supabaseInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey)
    }
    return supabaseInstance
}

export const supabase = typeof window !== 'undefined' ? initSupabase() : null

// For client components - returns the singleton
export const createClient = () => {
    if (typeof window === 'undefined') {
        // Return a dummy client during SSR/build that won't be used
        return createSupabaseClient(supabaseUrl, supabaseAnonKey)
    }
    return initSupabase()
}

// Alias for createClient
export const createBrowserClient = createClient

// Server-side Supabase client with service role (for admin operations)
export const createServerClient = () => {
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseServiceKey) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for server operations')
    }
    return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}

export default supabase
