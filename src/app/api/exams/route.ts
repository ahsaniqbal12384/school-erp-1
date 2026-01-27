// Exams API Routes
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch exams
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)
        const schoolId = searchParams.get('school_id')
        const status = searchParams.get('status')
        const examType = searchParams.get('exam_type')

        if (!schoolId) {
            return NextResponse.json({ error: 'School ID required' }, { status: 400 })
        }

        let query = supabase
            .from('exams')
            .select(`
                *,
                academic_year:academic_years(id, name),
                schedules:exam_schedules(
                    id, date, start_time, end_time, max_marks,
                    class:classes(id, name, section),
                    subject:subjects(id, name, code)
                )
            `)
            .eq('school_id', schoolId)
            .order('start_date', { ascending: false })

        if (status) {
            query = query.eq('status', status)
        }
        if (examType) {
            query = query.eq('exam_type', examType)
        }

        const { data, error } = await query

        if (error) throw error

        return NextResponse.json({ data })
    } catch (error: unknown) {
        console.error('Exams fetch error:', error)
        const message = error instanceof Error ? error.message : 'Failed to fetch exams'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// POST - Create exam
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const body = await request.json()

        const { school_id, name, exam_type, academic_year_id, start_date, end_date, schedules } = body

        if (!school_id || !name || !exam_type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Create exam
        const { data: exam, error: examError } = await (supabase
            .from('exams') as any)
            .insert({
                school_id,
                name,
                exam_type,
                academic_year_id,
                start_date,
                end_date,
                status: 'scheduled'
            })
            .select()
            .single()

        if (examError) throw examError

        // Create schedules if provided
        if (schedules?.length) {
            const scheduleRecords = schedules.map((s: {
                class_id: string;
                subject_id: string;
                date: string;
                start_time: string;
                end_time: string;
                max_marks: number;
                room?: string;
            }) => ({
                exam_id: exam.id,
                class_id: s.class_id,
                subject_id: s.subject_id,
                date: s.date,
                start_time: s.start_time,
                end_time: s.end_time,
                max_marks: s.max_marks || 100,
                room: s.room
            }))

            const { error: scheduleError } = await (supabase
                .from('exam_schedules') as any)
                .insert(scheduleRecords)

            if (scheduleError) throw scheduleError
        }

        return NextResponse.json({ data: exam }, { status: 201 })
    } catch (error: unknown) {
        console.error('Exam create error:', error)
        const message = error instanceof Error ? error.message : 'Failed to create exam'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// PATCH - Update exam status
export async function PATCH(request: NextRequest) {
    try {
        const supabase = await createClient()
        const body = await request.json()

        const { id, status, ...updateData } = body

        if (!id) {
            return NextResponse.json({ error: 'Exam ID required' }, { status: 400 })
        }

        const { data, error } = await (supabase
            .from('exams') as any)
            .update({ status, ...updateData })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ data })
    } catch (error: unknown) {
        console.error('Exam update error:', error)
        const message = error instanceof Error ? error.message : 'Failed to update exam'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
