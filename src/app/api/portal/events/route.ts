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

// GET /api/portal/events - Get school events
export async function GET(request: NextRequest) {
    try {
        const session = await verifyAuth(request)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = session.users
        const supabase = createServerClient()

        const searchParams = request.nextUrl.searchParams
        const type = searchParams.get('type')
        const upcoming = searchParams.get('upcoming')

        let query = supabase
            .from('school_events')
            .select('*')
            .eq('school_id', user.school_id)
            .order('start_date', { ascending: true })

        if (type && type !== 'all') {
            query = query.eq('type', type)
        }

        if (upcoming === 'true') {
            query = query.gte('start_date', new Date().toISOString())
        }

        const { data: events, error } = await query

        if (error) {
            return NextResponse.json({
                events: [],
                upcoming: null,
                source: 'empty'
            })
        }

        // Find next upcoming event
        const upcomingEvents = events?.filter(e => new Date(e.start_date) >= new Date())
        const nextEvent = upcomingEvents?.[0] || null

        return NextResponse.json({
            events: events || [],
            upcoming: nextEvent
        })
    } catch (error) {
        console.error('Portal events error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
