import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/client'

// PATCH /api/notifications/[id] - Mark notification as read
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
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

        const { data: notification, error } = await supabase
            .from('notifications')
            .update({ 
                is_read: true, 
                read_at: new Date().toISOString() 
            })
            .eq('id', id)
            .eq('user_id', session.user_id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ notification })
    } catch (error) {
        console.error('Update notification error:', error)
        return NextResponse.json(
            { error: 'Failed to update notification' },
            { status: 500 }
        )
    }
}

// DELETE /api/notifications/[id] - Delete a notification
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
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
            .delete()
            .eq('id', id)
            .eq('user_id', session.user_id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete notification error:', error)
        return NextResponse.json(
            { error: 'Failed to delete notification' },
            { status: 500 }
        )
    }
}
