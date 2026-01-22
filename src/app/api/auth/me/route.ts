import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/client'

// GET /api/auth/me - Get current user
export async function GET(request: NextRequest) {
    try {
        const supabase = createServerClient()

        // Get token from header
        const authHeader = request.headers.get('authorization')
        const token = authHeader?.replace('Bearer ', '')

        if (!token) {
            return NextResponse.json(
                { error: 'No authentication token provided' },
                { status: 401 }
            )
        }

        // Find session
        const { data: session, error: sessionError } = await supabase
            .from('user_sessions')
            .select('*, users(*)')
            .eq('token', token)
            .gt('expires_at', new Date().toISOString())
            .single()

        if (sessionError || !session) {
            return NextResponse.json(
                { error: 'Invalid or expired session' },
                { status: 401 }
            )
        }

        const user = session.users

        if (!user || !user.is_active) {
            return NextResponse.json(
                { error: 'User not found or inactive' },
                { status: 401 }
            )
        }

        // Get school data if user has a school
        let school = null
        let settings = null
        let modules: string[] = []

        if (user.school_id) {
            const { data: schoolData } = await supabase
                .from('schools')
                .select('*')
                .eq('id', user.school_id)
                .single()

            school = schoolData

            const { data: settingsData } = await supabase
                .from('school_settings')
                .select('*')
                .eq('school_id', user.school_id)
                .single()

            settings = settingsData

            const { data: modulesData } = await supabase
                .from('school_modules')
                .select('module_name')
                .eq('school_id', user.school_id)
                .eq('is_enabled', true)

            modules = modulesData?.map(m => m.module_name) || []
        }

        // Remove sensitive data
        const { password_hash, password_reset_token, ...safeUser } = user

        return NextResponse.json({
            user: safeUser,
            school,
            settings,
            modules
        })

    } catch (error) {
        console.error('Get user error:', error)
        return NextResponse.json(
            { error: 'An error occurred' },
            { status: 500 }
        )
    }
}
