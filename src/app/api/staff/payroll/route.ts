import { NextRequest, NextResponse } from 'next/server'
import { createUntypedClient as createClient } from '@/lib/supabase/server'

// GET - Fetch payroll records
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')
    const staffId = searchParams.get('staffId')
    const month = searchParams.get('month')
    const year = searchParams.get('year')
    const status = searchParams.get('status')

    if (!schoolId) {
      return NextResponse.json({ error: 'School ID is required' }, { status: 400 })
    }

    let query = supabase
      .from('payroll')
      .select(`
        *,
        staff:staff(id, first_name, last_name, employee_id, department:staff_departments(name), designation:staff_designations(name))
      `)
      .eq('school_id', schoolId)
      .order('year', { ascending: false })
      .order('month', { ascending: false })

    if (staffId) {
      query = query.eq('staff_id', staffId)
    }

    if (month) {
      query = query.eq('month', parseInt(month))
    }

    if (year) {
      query = query.eq('year', parseInt(year))
    }

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching payroll:', error)
      return NextResponse.json({ error: 'Failed to fetch payroll' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Payroll API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Generate payroll for a month
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { school_id, month, year, generated_by } = body

    if (!school_id || !month || !year) {
      return NextResponse.json(
        { error: 'Required fields: school_id, month, year' },
        { status: 400 }
      )
    }

    // Fetch all active staff for the school
    const { data: staffList, error: staffError } = await supabase
      .from('staff')
      .select('id, basic_salary, gross_salary')
      .eq('school_id', school_id)
      .eq('is_active', true)

    if (staffError) {
      console.error('Error fetching staff:', staffError)
      return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 })
    }

    // Generate payroll for each staff member
    const payrollRecords = staffList.map((staff) => ({
      school_id,
      staff_id: staff.id,
      month: parseInt(month),
      year: parseInt(year),
      basic_salary: staff.basic_salary || 0,
      gross_earnings: staff.gross_salary || staff.basic_salary || 0,
      total_deductions: 0,
      net_salary: staff.gross_salary || staff.basic_salary || 0,
      status: 'draft',
      generated_by,
      generated_on: new Date().toISOString(),
      working_days: 26, // Default working days
      present_days: 26,
      absent_days: 0,
      leave_days: 0,
      late_days: 0,
    }))

    // Upsert payroll records (update if exists)
    const { data, error } = await supabase
      .from('payroll')
      .upsert(payrollRecords, {
        onConflict: 'staff_id,month,year',
      })
      .select()

    if (error) {
      console.error('Error generating payroll:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      message: `Payroll generated for ${payrollRecords.length} staff members`,
      data 
    }, { status: 201 })
  } catch (error) {
    console.error('Payroll API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
