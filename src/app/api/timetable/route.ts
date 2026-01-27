// Timetable API Routes
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch timetable
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)
        const schoolId = searchParams.get('school_id')
        const classId = searchParams.get('class_id')
        const teacherId = searchParams.get('teacher_id')
        const dayOfWeek = searchParams.get('day_of_week')

        if (!schoolId) {
            return NextResponse.json({ error: 'School ID required' }, { status: 400 })
        }

        let query = (supabase
            .from('timetable') as any)
            .select(`
                *,
                class:classes(id, name, section),
                subject:subjects(id, name, code),
                teacher:users(id, first_name, last_name),
                period:periods(id, name, start_time, end_time, period_order, is_break)
            `)
            .eq('school_id', schoolId)
            .eq('is_active', true)
            .order('day_of_week', { ascending: true })

        if (classId) {
            query = query.eq('class_id', classId)
        }
        if (teacherId) {
            query = query.eq('teacher_id', teacherId)
        }
        if (dayOfWeek !== null && dayOfWeek !== undefined) {
            query = query.eq('day_of_week', parseInt(dayOfWeek))
        }

        const { data, error } = await query

        if (error) throw error

        // Group by day and period for easier frontend consumption
        const grouped: Record<number, Record<string, any>> = {}
        data?.forEach((entry: any) => {
            if (!grouped[entry.day_of_week]) {
                grouped[entry.day_of_week] = {}
            }
            grouped[entry.day_of_week][entry.period_id] = entry
        })

        return NextResponse.json({ data, grouped })
    } catch (error: unknown) {
        console.error('Timetable fetch error:', error)
        const message = error instanceof Error ? error.message : 'Failed to fetch timetable'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// POST - Create/Update timetable entries
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const body = await request.json()

        const { school_id, class_id, entries, academic_year_id } = body

        if (!school_id || !class_id || !entries?.length) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Deactivate existing timetable for this class
        await (supabase
            .from('timetable') as any)
            .update({ is_active: false })
            .eq('school_id', school_id)
            .eq('class_id', class_id)

        // Insert new entries
        const timetableRecords = entries.map((e: {
            period_id: string;
            day_of_week: number;
            subject_id?: string;
            teacher_id?: string;
            room?: string;
        }) => ({
            school_id,
            class_id,
            period_id: e.period_id,
            day_of_week: e.day_of_week,
            subject_id: e.subject_id || null,
            teacher_id: e.teacher_id || null,
            room: e.room || null,
            academic_year_id,
            is_active: true
        }))

        const { data, error } = await (supabase
            .from('timetable') as any)
            .insert(timetableRecords)
            .select()

        if (error) throw error

        return NextResponse.json({ data, count: timetableRecords.length }, { status: 201 })
    } catch (error: unknown) {
        console.error('Timetable create error:', error)
        const message = error instanceof Error ? error.message : 'Failed to create timetable'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// PATCH - Update single timetable entry
export async function PATCH(request: NextRequest) {
    try {
        const supabase = await createClient()
        const body = await request.json()

        const { id, subject_id, teacher_id, room } = body

        if (!id) {
            return NextResponse.json({ error: 'Entry ID required' }, { status: 400 })
        }

        const { data, error } = await (supabase
            .from('timetable') as any)
            .update({
                subject_id,
                teacher_id,
                room,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ data })
    } catch (error: unknown) {
        console.error('Timetable update error:', error)
        const message = error instanceof Error ? error.message : 'Failed to update timetable'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
