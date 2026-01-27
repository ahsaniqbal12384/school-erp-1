//  Fee Management API Routes
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch fee structures
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)
        const schoolId = searchParams.get('school_id')
        const classId = searchParams.get('class_id')

        if (!schoolId) {
            return NextResponse.json({ error: 'School ID required' }, { status: 400 })
        }

        let query = supabase
            .from('fee_structures')
            .select(`
                *,
                class:classes(id, name, grade_level, section),
                academic_year:academic_years(id, name, start_date, end_date)
            `)
            .eq('school_id', schoolId)
            .order('created_at', { ascending: false })

        if (classId) {
            query = query.eq('class_id', classId)
        }

        const { data, error } = await query

        if (error) throw error

        return NextResponse.json({ data })
    } catch (error: unknown) {
        console.error('Fee structures fetch error:', error)
        const message = error instanceof Error ? error.message : 'Failed to fetch fee structures'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// POST - Create fee structure
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const body = await request.json()

        const { school_id, class_id, fee_type, name, amount, frequency, is_optional, academic_year_id } = body

        if (!school_id || !fee_type || !name || !amount) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const { data, error } = await (supabase
            .from('fee_structures') as any)
            .insert({
                school_id,
                class_id,
                fee_type,
                name,
                amount,
                frequency: frequency || 'monthly',
                is_optional: is_optional || false,
                academic_year_id
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ data }, { status: 201 })
    } catch (error: unknown) {
        console.error('Fee structure create error:', error)
        const message = error instanceof Error ? error.message : 'Failed to create fee structure'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
