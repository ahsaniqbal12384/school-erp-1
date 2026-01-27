// Attendance API Routes
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch attendance records
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)
        const schoolId = searchParams.get('school_id')
        const classId = searchParams.get('class_id')
        const studentId = searchParams.get('student_id')
        const date = searchParams.get('date')
        const startDate = searchParams.get('start_date')
        const endDate = searchParams.get('end_date')

        if (!schoolId) {
            return NextResponse.json({ error: 'School ID required' }, { status: 400 })
        }

        let query = supabase
            .from('attendance')
            .select(`
                *,
                student:students(id, first_name, last_name, roll_number, gender,
                    class:classes(id, name, section)
                ),
                marked_by_user:users!attendance_marked_by_fkey(id, first_name, last_name)
            `)
            .eq('school_id', schoolId)
            .order('date', { ascending: false })

        if (classId) {
            query = query.eq('class_id', classId)
        }
        if (studentId) {
            query = query.eq('student_id', studentId)
        }
        if (date) {
            query = query.eq('date', date)
        }
        if (startDate) {
            query = query.gte('date', startDate)
        }
        if (endDate) {
            query = query.lte('date', endDate)
        }

        const { data, error } = await query

        if (error) throw error

        return NextResponse.json({ data })
    } catch (error: unknown) {
        console.error('Attendance fetch error:', error)
        const message = error instanceof Error ? error.message : 'Failed to fetch attendance'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// POST - Mark attendance (bulk)
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const body = await request.json()

        const { school_id, class_id, date, attendance_records, marked_by } = body

        if (!school_id || !class_id || !date || !attendance_records?.length) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Delete existing attendance for this class and date
        await supabase
            .from('attendance')
            .delete()
            .eq('school_id', school_id)
            .eq('class_id', class_id)
            .eq('date', date)

        // Insert new attendance records
        const records = attendance_records.map((record: { student_id: string; status: string; remarks?: string }) => ({
            school_id,
            class_id,
            student_id: record.student_id,
            date,
            status: record.status,
            remarks: record.remarks || null,
            marked_by
        }))

        const { data, error } = await supabase
            .from('attendance')
            .insert(records)
            .select()

        if (error) throw error

        return NextResponse.json({ data, count: records.length }, { status: 201 })
    } catch (error: unknown) {
        console.error('Attendance mark error:', error)
        const message = error instanceof Error ? error.message : 'Failed to mark attendance'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// PATCH - Update single attendance record
export async function PATCH(request: NextRequest) {
    try {
        const supabase = await createClient()
        const body = await request.json()

        const { id, status, remarks } = body

        if (!id || !status) {
            return NextResponse.json({ error: 'ID and status required' }, { status: 400 })
        }

        const { data, error } = await (supabase
            .from('attendance') as any)
            .update({ status, remarks })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ data })
    } catch (error: unknown) {
        console.error('Attendance update error:', error)
        const message = error instanceof Error ? error.message : 'Failed to update attendance'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
