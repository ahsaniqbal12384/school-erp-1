import { NextRequest, NextResponse } from 'next/server'
import { createUntypedClient as createClient } from '@/lib/supabase/server'

// GET - Fetch leave applications
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')
    const staffId = searchParams.get('staffId')
    const status = searchParams.get('status')

    if (!schoolId) {
      return NextResponse.json({ error: 'School ID is required' }, { status: 400 })
    }

    let query = supabase
      .from('leave_applications')
      .select(`
        *,
        staff:staff(id, first_name, last_name, employee_id, department:staff_departments(name)),
        leave_type:leave_types(id, name, code, is_paid)
      `)
      .eq('school_id', schoolId)
      .order('applied_on', { ascending: false })

    if (staffId) {
      query = query.eq('staff_id', staffId)
    }

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching leave applications:', error)
      return NextResponse.json({ error: 'Failed to fetch leave applications' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Leave API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create a new leave application
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      school_id,
      staff_id,
      leave_type_id,
      start_date,
      end_date,
      reason,
      document_url,
    } = body

    if (!school_id || !staff_id || !leave_type_id || !start_date || !end_date || !reason) {
      return NextResponse.json(
        { error: 'Required fields: school_id, staff_id, leave_type_id, start_date, end_date, reason' },
        { status: 400 }
      )
    }

    // Calculate total days
    const start = new Date(start_date)
    const end = new Date(end_date)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const total_days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

    const { data, error } = await supabase
      .from('leave_applications')
      .insert({
        school_id,
        staff_id,
        leave_type_id,
        start_date,
        end_date,
        total_days,
        reason,
        document_url,
        status: 'pending',
        applied_on: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating leave application:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Leave API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
