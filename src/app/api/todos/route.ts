import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/client'

// GET /api/todos - Get user's todos
export async function GET(request: NextRequest) {
    try {
        const supabase = createServerClient()
        
        // Get user from session token
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
        const status = searchParams.get('status')
        const limit = parseInt(searchParams.get('limit') || '20')

        let query = supabase
            .from('todos')
            .select('*')
            .eq('user_id', session.user_id)
            .order('due_date', { ascending: true, nullsFirst: false })
            .order('priority', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(limit)

        if (status && status !== 'all') {
            query = query.eq('status', status)
        }

        const { data: todos, error } = await query

        if (error) throw error

        return NextResponse.json({ todos: todos || [] })
    } catch (error) {
        console.error('Get todos error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch todos' },
            { status: 500 }
        )
    }
}

// POST /api/todos - Create a new todo
export async function POST(request: NextRequest) {
    try {
        const supabase = createServerClient()
        
        const token = request.cookies.get('session_token')?.value
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: session } = await supabase
            .from('user_sessions')
            .select('user_id, users(school_id)')
            .eq('token', token)
            .gt('expires_at', new Date().toISOString())
            .single()

        if (!session) {
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
        }

        const body = await request.json()
        const { title, description, due_date, priority, category } = body

        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 })
        }

        const { data: todo, error } = await supabase
            .from('todos')
            .insert({
                user_id: session.user_id,
                school_id: (session.users as any)?.school_id || null,
                title,
                description: description || null,
                due_date: due_date || null,
                priority: priority || 'medium',
                category: category || 'general',
                status: 'pending'
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ todo }, { status: 201 })
    } catch (error) {
        console.error('Create todo error:', error)
        return NextResponse.json(
            { error: 'Failed to create todo' },
            { status: 500 }
        )
    }
}
