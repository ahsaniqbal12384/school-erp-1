import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/client'
import bcrypt from 'bcryptjs'

// POST /api/auth/login - Login
export async function POST(request: NextRequest) {
    try {
        const supabase = createServerClient()
        const body = await request.json()

        const { email, password, schoolSlug } = body

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            )
        }

        // Find user by email
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*, schools(*)')
            .eq('email', email.toLowerCase())
            .single()

        if (userError || !user) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            )
        }

        // Check if user is active
        if (!user.is_active) {
            return NextResponse.json(
                { error: 'Your account has been deactivated' },
                { status: 401 }
            )
        }

        // Check if account is locked
        if (user.locked_until && new Date(user.locked_until) > new Date()) {
            return NextResponse.json(
                { error: 'Account is temporarily locked. Try again later.' },
                { status: 401 }
            )
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash)

        if (!isValidPassword) {
            // Increment failed login attempts
            await supabase
                .from('users')
                .update({
                    failed_login_attempts: (user.failed_login_attempts || 0) + 1,
                    locked_until: (user.failed_login_attempts || 0) >= 4
                        ? new Date(Date.now() + 15 * 60 * 1000).toISOString() // Lock for 15 mins
                        : null
                })
                .eq('id', user.id)

            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            )
        }

        // If schoolSlug provided, verify user belongs to that school
        if (schoolSlug && user.school_id) {
            const { data: school } = await supabase
                .from('schools')
                .select('slug, is_active, subscription_status')
                .eq('id', user.school_id)
                .single()

            if (!school) {
                return NextResponse.json(
                    { error: 'School not found' },
                    { status: 404 }
                )
            }

            if (school.slug !== schoolSlug) {
                return NextResponse.json(
                    { error: 'You do not have access to this school' },
                    { status: 403 }
                )
            }

            if (!school.is_active) {
                return NextResponse.json(
                    { error: 'This school has been deactivated' },
                    { status: 403 }
                )
            }

            if (school.subscription_status === 'suspended' || school.subscription_status === 'expired') {
                return NextResponse.json(
                    { error: 'School subscription has expired. Contact administrator.' },
                    { status: 403 }
                )
            }
        }

        // Generate session token
        const token = crypto.randomUUID()
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

        // Create session
        await supabase
            .from('user_sessions')
            .insert({
                user_id: user.id,
                school_id: user.school_id,
                token,
                expires_at: expiresAt.toISOString(),
                ip_address: request.headers.get('x-forwarded-for') || 'unknown',
                user_agent: request.headers.get('user-agent') || 'unknown'
            })

        // Update last login
        await supabase
            .from('users')
            .update({
                last_login: new Date().toISOString(),
                login_count: (user.login_count || 0) + 1,
                failed_login_attempts: 0,
                locked_until: null
            })
            .eq('id', user.id)

        // Get enabled modules if user has a school
        let modules: string[] = []
        if (user.school_id) {
            const { data: schoolModules } = await supabase
                .from('school_modules')
                .select('module_name')
                .eq('school_id', user.school_id)
                .eq('is_enabled', true)

            modules = schoolModules?.map(m => m.module_name) || []
        }

        // Remove sensitive data
        const { password_hash, password_reset_token, ...safeUser } = user

        return NextResponse.json({
            success: true,
            user: safeUser,
            token,
            expiresAt: expiresAt.toISOString(),
            modules,
            message: 'Login successful'
        })

    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: 'An error occurred during login' },
            { status: 500 }
        )
    }
}
