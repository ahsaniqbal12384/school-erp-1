import { NextRequest, NextResponse } from 'next/server'
import { createUntypedClient as createClient } from '@/lib/supabase/server'

// GET - Fetch library members for a school
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')
    const memberType = searchParams.get('memberType')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    if (!schoolId) {
      return NextResponse.json({ error: 'School ID is required' }, { status: 400 })
    }

    let query = supabase
      .from('library_members')
      .select(`
        *,
        student:students(id, first_name, last_name, admission_no, class:classes(name)),
        staff:staff(id, first_name, last_name, employee_id, department:staff_departments(name))
      `)
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false })

    if (memberType && memberType !== 'all') {
      query = query.eq('member_type', memberType)
    }

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.or(`membership_no.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching members:', error)
      return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Members API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create a new library member
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      school_id,
      member_type,
      student_id,
      staff_id,
      max_books,
      max_days,
    } = body

    if (!school_id || !member_type) {
      return NextResponse.json(
        { error: 'Required fields: school_id, member_type' },
        { status: 400 }
      )
    }

    if (member_type === 'student' && !student_id) {
      return NextResponse.json(
        { error: 'student_id is required for student members' },
        { status: 400 }
      )
    }

    if (member_type === 'staff' && !staff_id) {
      return NextResponse.json(
        { error: 'staff_id is required for staff members' },
        { status: 400 }
      )
    }

    // Generate membership number
    const membershipNo = `LIB-${Date.now().toString(36).toUpperCase()}`

    const { data, error } = await supabase
      .from('library_members')
      .insert({
        school_id,
        membership_no: membershipNo,
        member_type,
        student_id: member_type === 'student' ? student_id : null,
        staff_id: member_type === 'staff' ? staff_id : null,
        max_books: max_books || (member_type === 'student' ? 2 : 5),
        max_days: max_days || (member_type === 'student' ? 14 : 30),
        status: 'active',
        current_books_count: 0,
        total_books_issued: 0,
        total_fines_paid: 0,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating member:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Members API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
