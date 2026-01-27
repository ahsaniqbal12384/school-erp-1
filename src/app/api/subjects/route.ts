// Subjects API Routes
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch subjects
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)
        const schoolId = searchParams.get('school_id')
        const classId = searchParams.get('class_id')

        if (!schoolId) {
            return NextResponse.json({ error: 'School ID required' }, { status: 400 })
        }

        // If class_id provided, get subjects for that class
        if (classId) {
            const { data, error } = await supabase
                .from('class_subjects')
                .select(`
                    *,
                    subject:subjects(id, name, code, description),
                    teacher:users(id, first_name, last_name)
                `)
                .eq('class_id', classId)

            if (error) throw error
            return NextResponse.json({ data })
        }

        // Otherwise get all subjects for the school
        const { data, error } = await supabase
            .from('subjects')
            .select('*')
            .eq('school_id', schoolId)
            .order('name', { ascending: true })

        if (error) throw error

        return NextResponse.json({ data })
    } catch (error: unknown) {
        console.error('Subjects fetch error:', error)
        const message = error instanceof Error ? error.message : 'Failed to fetch subjects'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// POST - Create subject
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const body = await request.json()

        const { school_id, name, code, description, periods_per_week } = body

        if (!school_id || !name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const { data, error } = await (supabase
            .from('subjects') as any)
            .insert({
                school_id,
                name,
                code,
                description,
                periods_per_week: periods_per_week || 5
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ data }, { status: 201 })
    } catch (error: unknown) {
        console.error('Subject create error:', error)
        const message = error instanceof Error ? error.message : 'Failed to create subject'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
