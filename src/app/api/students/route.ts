// Students API Routes
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch students
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)
        const schoolId = searchParams.get('school_id')
        const classId = searchParams.get('class_id')
        const search = searchParams.get('search')
        const limit = searchParams.get('limit')

        if (!schoolId) {
            return NextResponse.json({ error: 'School ID required' }, { status: 400 })
        }

        let query = supabase
            .from('students')
            .select(`
                *,
                class:classes(id, name, section, grade_level),
                user:users(id, email, is_active)
            `)
            .eq('school_id', schoolId)
            .order('roll_number', { ascending: true })

        if (classId) {
            query = query.eq('class_id', classId)
        }

        if (search) {
            query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,roll_number.ilike.%${search}%`)
        }

        if (limit) {
            query = query.limit(parseInt(limit))
        }

        const { data, error } = await query

        if (error) throw error

        return NextResponse.json({ data })
    } catch (error: unknown) {
        console.error('Students fetch error:', error)
        const message = error instanceof Error ? error.message : 'Failed to fetch students'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// POST - Create student
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const body = await request.json()

        const {
            school_id,
            class_id,
            first_name,
            last_name,
            roll_number,
            date_of_birth,
            gender,
            admission_date,
            father_name,
            mother_name,
            guardian_phone,
            address,
            blood_group,
            user_id
        } = body

        if (!school_id || !first_name || !last_name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const { data, error } = await (supabase
            .from('students') as any)
            .insert({
                school_id,
                class_id,
                first_name,
                last_name,
                roll_number,
                date_of_birth,
                gender,
                admission_date: admission_date || new Date().toISOString().split('T')[0],
                father_name,
                mother_name,
                guardian_phone,
                address,
                blood_group,
                user_id
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ data }, { status: 201 })
    } catch (error: unknown) {
        console.error('Student create error:', error)
        const message = error instanceof Error ? error.message : 'Failed to create student'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
