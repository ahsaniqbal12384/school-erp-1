import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/client'

// POST /api/notifications/mark-all-read - Mark all notifications as read
export async function POST(request: NextRequest) {
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

        const { error } = await supabase
            .from('notifications')
            .update({ 
                is_read: true, 
                read_at: new Date().toISOString() 
            })
            .eq('user_id', session.user_id)
            .eq('is_read', false)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Mark all read error:', error)
        return NextResponse.json(
            { error: 'Failed to mark notifications as read' },
            { status: 500 }
        )
    }
}
