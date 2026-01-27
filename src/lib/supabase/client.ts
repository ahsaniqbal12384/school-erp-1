import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Check if Supabase is configured
const isConfigured = supabaseUrl && supabaseAnonKey

// Client-side Supabase client singleton
// Only create client if properly configured
export const supabase = isConfigured 
    ? createSupabaseClient(supabaseUrl, supabaseAnonKey)
    : null as unknown as ReturnType<typeof createSupabaseClient>

// For client components - returns the singleton
export const createClient = () => {
    if (!isConfigured) {
        console.warn('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.')
    }
    return supabase
}

// Alias for createClient
export const createBrowserClient = createClient

// Server-side Supabase client with service role (for admin operations)
export const createServerClient = () => {
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    
    if (!supabaseUrl || !supabaseServiceKey) {
        console.warn('Supabase server client is not configured. Please set environment variables.')
        // Return a mock client for development
        return null as unknown as ReturnType<typeof createSupabaseClient>
    }
    
    return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}

export default supabase
