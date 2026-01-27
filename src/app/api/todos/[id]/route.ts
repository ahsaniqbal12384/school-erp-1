import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/client'

// PATCH /api/todos/[id] - Update a todo
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

        const body = await request.json()
        const { title, description, due_date, priority, category, status } = body

        const updateData: Record<string, any> = { updated_at: new Date().toISOString() }
        if (title !== undefined) updateData.title = title
        if (description !== undefined) updateData.description = description
        if (due_date !== undefined) updateData.due_date = due_date
        if (priority !== undefined) updateData.priority = priority
        if (category !== undefined) updateData.category = category
        if (status !== undefined) {
            updateData.status = status
            if (status === 'completed') {
                updateData.completed_at = new Date().toISOString()
            } else {
                updateData.completed_at = null
            }
        }

        const { data: todo, error } = await supabase
            .from('todos')
            .update(updateData)
            .eq('id', id)
            .eq('user_id', session.user_id)
            .select()
            .single()

        if (error) throw error

        if (!todo) {
            return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
        }

        return NextResponse.json({ todo })
    } catch (error) {
        console.error('Update todo error:', error)
        return NextResponse.json(
            { error: 'Failed to update todo' },
            { status: 500 }
        )
    }
}

// DELETE /api/todos/[id] - Delete a todo
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
            .from('todos')
            .delete()
            .eq('id', id)
            .eq('user_id', session.user_id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete todo error:', error)
        return NextResponse.json(
            { error: 'Failed to delete todo' },
            { status: 500 }
        )
    }
}
