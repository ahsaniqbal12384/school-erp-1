// Classes API Routes
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch classes
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)
        const schoolId = searchParams.get('school_id')
        const withStudents = searchParams.get('with_students') === 'true'

        if (!schoolId) {
            return NextResponse.json({ error: 'School ID required' }, { status: 400 })
        }

        let query = (supabase
            .from('classes') as any)
            .select(`
                *,
                class_teacher:users!classes_class_teacher_id_fkey(id, first_name, last_name),
                academic_year:academic_years(id, name)
            `)
            .eq('school_id', schoolId)
            .order('grade_level', { ascending: true })

        const { data, error } = await query

        if (error) throw error

        // If students needed, fetch separately
        if (withStudents && data) {
            const classIds = data.map((c: any) => c.id)
            const { data: students } = await (supabase
                .from('students') as any)
                .select('id, first_name, last_name, roll_number, class_id, gender')
                .in('class_id', classIds)
                .order('roll_number', { ascending: true })

            // Attach students to classes
            const classesWithStudents = data.map((cls: any) => ({
                ...cls,
                students: students?.filter((s: any) => s.class_id === cls.id) || []
            }))

            return NextResponse.json({ data: classesWithStudents })
        }

        return NextResponse.json({ data })
    } catch (error: unknown) {
        console.error('Classes fetch error:', error)
        const message = error instanceof Error ? error.message : 'Failed to fetch classes'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// POST - Create class
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const body = await request.json()

        const { school_id, name, grade_level, section, capacity, class_teacher_id, academic_year_id, monthly_fee } = body

        if (!school_id || !name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const { data, error } = await (supabase
            .from('classes') as any)
            .insert({
                school_id,
                name,
                grade_level,
                section,
                capacity: capacity || 40,
                class_teacher_id,
                academic_year_id,
                monthly_fee: monthly_fee || 0
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ data }, { status: 201 })
    } catch (error: unknown) {
        console.error('Class create error:', error)
        const message = error instanceof Error ? error.message : 'Failed to create class'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
