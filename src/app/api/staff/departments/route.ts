import { NextRequest, NextResponse } from 'next/server'
import { createUntypedClient as createClient } from '@/lib/supabase/server'

// GET - Fetch all departments for a school
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')

    if (!schoolId) {
      return NextResponse.json({ error: 'School ID is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('staff_departments')
      .select(`
        *,
        head:staff(id, first_name, last_name, employee_id),
        staff_count:staff(count)
      `)
      .eq('school_id', schoolId)
      .eq('is_active', true)
      .order('name')

    if (error) {
      console.error('Error fetching departments:', error)
      return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Departments API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create a new department
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { school_id, name, description, head_id } = body

    if (!school_id || !name) {
      return NextResponse.json(
        { error: 'Required fields: school_id, name' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('staff_departments')
      .insert({
        school_id,
        name,
        description,
        head_id,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating department:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Departments API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
