// Password Change API
// POST: Change password for authenticated user

import { createClient } from '@/lib/supabase/server'
import { createServerClient } from '@/lib/supabase/client'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
    try {
        const supabase = createServerClient()
        const body = await request.json()

        const { user_id, current_password, new_password } = body

        if (!user_id || !current_password || !new_password) {
            return NextResponse.json(
                { error: 'User ID, current password, and new password are required' },
                { status: 400 }
            )
        }

        // Validate new password
        if (new_password.length < 6) {
            return NextResponse.json(
                { error: 'New password must be at least 6 characters' },
                { status: 400 }
            )
        }

        // Fetch user to verify current password
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('id, password_hash')
            .eq('id', user_id)
            .single()

        if (fetchError || !user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Verify current password
        const isValid = await bcrypt.compare(current_password, user.password_hash)
        if (!isValid) {
            return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })
        }

        // Hash new password
        const password_hash = await bcrypt.hash(new_password, 10)

        // Update password
        const { error: updateError } = await supabase
            .from('users')
            .update({
                password_hash,
                updated_at: new Date().toISOString()
            })
            .eq('id', user_id)

        if (updateError) {
            throw updateError
        }

        return NextResponse.json({
            success: true,
            message: 'Password changed successfully'
        })
    } catch (error: unknown) {
        console.error('Password change error:', error)
        const message = error instanceof Error ? error.message : 'Failed to change password'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
