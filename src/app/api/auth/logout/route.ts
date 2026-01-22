import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/client'

// POST /api/auth/logout - Logout
export async function POST(request: NextRequest) {
    try {
        const supabase = createServerClient()

        // Get token from header
        const authHeader = request.headers.get('authorization')
        const token = authHeader?.replace('Bearer ', '')

        if (token) {
            // Delete session
            await supabase
                .from('user_sessions')
                .delete()
                .eq('token', token)
        }

        return NextResponse.json({
            success: true,
            message: 'Logged out successfully'
        })

    } catch (error) {
        console.error('Logout error:', error)
        return NextResponse.json(
            { error: 'An error occurred during logout' },
            { status: 500 }
        )
    }
}
