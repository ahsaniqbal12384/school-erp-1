// Periods API Routes
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch periods
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)
        const schoolId = searchParams.get('school_id')

        if (!schoolId) {
            return NextResponse.json({ error: 'School ID required' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('periods')
            .select('*')
            .eq('school_id', schoolId)
            .order('period_order', { ascending: true })

        if (error) throw error

        return NextResponse.json({ data })
    } catch (error: unknown) {
        console.error('Periods fetch error:', error)
        const message = error instanceof Error ? error.message : 'Failed to fetch periods'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// POST - Create periods (bulk)
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const body = await request.json()

        const { school_id, periods } = body

        if (!school_id || !periods?.length) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const periodRecords = periods.map((p: {
            name: string;
            start_time: string;
            end_time: string;
            period_order: number;
            is_break?: boolean;
        }) => ({
            school_id,
            name: p.name,
            start_time: p.start_time,
            end_time: p.end_time,
            period_order: p.period_order,
            is_break: p.is_break || false
        }))

        const { data, error } = await supabase
            .from('periods')
            .insert(periodRecords)
            .select()

        if (error) throw error

        return NextResponse.json({ data }, { status: 201 })
    } catch (error: unknown) {
        console.error('Periods create error:', error)
        const message = error instanceof Error ? error.message : 'Failed to create periods'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// DELETE - Delete all periods for a school (to reset)
export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)
        const schoolId = searchParams.get('school_id')

        if (!schoolId) {
            return NextResponse.json({ error: 'School ID required' }, { status: 400 })
        }

        const { error } = await supabase
            .from('periods')
            .delete()
            .eq('school_id', schoolId)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: unknown) {
        console.error('Periods delete error:', error)
        const message = error instanceof Error ? error.message : 'Failed to delete periods'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
