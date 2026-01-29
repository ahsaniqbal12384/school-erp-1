import { NextRequest, NextResponse } from 'next/server'
import { createUntypedClient as createClient } from '@/lib/supabase/server'

// GET - Fetch all staff for a school
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')
    const departmentId = searchParams.get('departmentId')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    if (!schoolId) {
      return NextResponse.json({ error: 'School ID is required' }, { status: 400 })
    }

    let query = supabase
      .from('staff')
      .select(`
        *,
        department:staff_departments(id, name),
        designation:staff_designations(id, name, is_teaching)
      `)
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false })

    if (departmentId && departmentId !== 'all') {
      query = query.eq('department_id', departmentId)
    }

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,employee_id.ilike.%${search}%,email.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching staff:', error)
      return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Staff API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create a new staff member
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      school_id,
      employee_id,
      first_name,
      last_name,
      email,
      phone,
      department_id,
      designation_id,
      date_of_birth,
      gender,
      marital_status,
      cnic,
      address,
      city,
      joining_date,
      employment_type,
      basic_salary,
      bank_name,
      bank_account_no,
      bank_branch,
      qualification,
      experience_years,
      emergency_contact,
      emergency_phone,
      photo_url,
    } = body

    if (!school_id || !employee_id || !first_name || !last_name) {
      return NextResponse.json(
        { error: 'Required fields: school_id, employee_id, first_name, last_name' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('staff')
      .insert({
        school_id,
        employee_id,
        first_name,
        last_name,
        email,
        phone,
        department_id,
        designation_id,
        date_of_birth,
        gender,
        marital_status,
        cnic,
        address,
        city,
        joining_date,
        employment_type: employment_type || 'full_time',
        basic_salary: basic_salary || 0,
        bank_name,
        bank_account_no,
        bank_branch,
        qualification,
        experience_years,
        emergency_contact,
        emergency_phone,
        photo_url,
        status: 'active',
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating staff:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Staff API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
