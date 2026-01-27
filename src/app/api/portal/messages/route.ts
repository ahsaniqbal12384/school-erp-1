import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/client'

// Helper to verify auth token
async function verifyAuth(request: NextRequest) {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) return null

    const supabase = createServerClient()
    const { data: session } = await supabase
        .from('user_sessions')
        .select('*, users(*)')
        .eq('token', token)
        .gt('expires_at', new Date().toISOString())
        .single()

    return session
}

// GET /api/portal/messages - Get messages
export async function GET(request: NextRequest) {
    try {
        const session = await verifyAuth(request)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = session.users
        const supabase = createServerClient()

        const { data: messages, error } = await supabase
            .from('messages')
            .select(`
                *,
                sender:users!messages_sender_id_fkey(id, first_name, last_name, role),
                recipient:users!messages_recipient_id_fkey(id, first_name, last_name, role)
            `)
            .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
            .order('created_at', { ascending: false })

        if (error) {
            return NextResponse.json({
                messages: [],
                unreadCount: 0,
                source: 'empty'
            })
        }

        // Count unread messages
        const unreadCount = messages?.filter(m => m.recipient_id === user.id && !m.is_read).length || 0

        return NextResponse.json({
            messages: messages || [],
            unreadCount
        })
    } catch (error) {
        console.error('Portal messages error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST /api/portal/messages - Send a message
export async function POST(request: NextRequest) {
    try {
        const session = await verifyAuth(request)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = session.users
        const body = await request.json()
        const { recipient_id, subject, content, student_id, department } = body

        if (!subject || !content) {
            return NextResponse.json({ error: 'Subject and content are required' }, { status: 400 })
        }

        const supabase = createServerClient()

        const { data: message, error } = await supabase
            .from('messages')
            .insert({
                school_id: user.school_id,
                sender_id: user.id,
                recipient_id,
                subject,
                content,
                student_id,
                department,
                is_read: false,
                created_at: new Date().toISOString()
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            message
        })
    } catch (error) {
        console.error('Portal message send error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// PATCH /api/portal/messages - Mark message as read
export async function PATCH(request: NextRequest) {
    try {
        const session = await verifyAuth(request)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { message_id } = body

        if (!message_id) {
            return NextResponse.json({ error: 'Message ID is required' }, { status: 400 })
        }

        const supabase = createServerClient()

        const { error } = await supabase
            .from('messages')
            .update({ is_read: true, read_at: new Date().toISOString() })
            .eq('id', message_id)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Portal message update error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
