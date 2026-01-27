import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/client'

// GET /api/notifications - Get user's notifications
export async function GET(request: NextRequest) {
    try {
        const supabase = createServerClient()
        
        const token = request.cookies.get('session_token')?.value
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: session } = await supabase
            .from('user_sessions')
            .select('user_id')
            .eq('token', token)
            .gt('expires_at', new Date().toISOString())
            .single()

        if (!session) {
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const unreadOnly = searchParams.get('unread') === 'true'
        const limit = parseInt(searchParams.get('limit') || '20')

        let query = supabase
            .from('notifications')
            .select('*')
            .eq('user_id', session.user_id)
            .order('created_at', { ascending: false })
            .limit(limit)

        if (unreadOnly) {
            query = query.eq('is_read', false)
        }

        const { data: notifications, error } = await query

        if (error) throw error

        // Get unread count
        const { count: unreadCount } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', session.user_id)
            .eq('is_read', false)

        return NextResponse.json({ 
            notifications: notifications || [],
            unreadCount: unreadCount || 0
        })
    } catch (error) {
        console.error('Get notifications error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch notifications' },
            { status: 500 }
        )
    }
}

// POST /api/notifications - Create a notification (admin only)
export async function POST(request: NextRequest) {
    try {
        const supabase = createServerClient()
        
        const token = request.cookies.get('session_token')?.value
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: session } = await supabase
            .from('user_sessions')
            .select('user_id, users(role, school_id)')
            .eq('token', token)
            .gt('expires_at', new Date().toISOString())
            .single()

        if (!session) {
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
        }

        const userRole = (session.users as any)?.role
        if (!['super_admin', 'school_admin', 'teacher'].includes(userRole)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const body = await request.json()
        const { user_id, title, message, type, category, link } = body

        if (!user_id || !title || !message) {
            return NextResponse.json({ error: 'user_id, title, and message are required' }, { status: 400 })
        }

        const { data: notification, error } = await supabase
            .from('notifications')
            .insert({
                user_id,
                school_id: (session.users as any)?.school_id,
                title,
                message,
                type: type || 'info',
                category: category || 'general',
                link
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ notification }, { status: 201 })
    } catch (error) {
        console.error('Create notification error:', error)
        return NextResponse.json(
            { error: 'Failed to create notification' },
            { status: 500 }
        )
    }
}
