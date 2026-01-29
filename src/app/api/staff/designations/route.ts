import { NextRequest, NextResponse } from 'next/server'
import { createUntypedClient as createClient } from '@/lib/supabase/server'

// GET - Fetch all designations for a school
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')
    const departmentId = searchParams.get('departmentId')

    if (!schoolId) {
      return NextResponse.json({ error: 'School ID is required' }, { status: 400 })
    }

    let query = supabase
      .from('staff_designations')
      .select(`
        *,
        department:staff_departments(id, name)
      `)
      .eq('school_id', schoolId)
      .eq('is_active', true)
      .order('name')

    if (departmentId) {
      query = query.eq('department_id', departmentId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching designations:', error)
      return NextResponse.json({ error: 'Failed to fetch designations' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Designations API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create a new designation
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { school_id, name, description, department_id, base_salary, is_teaching } = body

    if (!school_id || !name) {
      return NextResponse.json(
        { error: 'Required fields: school_id, name' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('staff_designations')
      .insert({
        school_id,
        name,
        description,
        department_id,
        base_salary: base_salary || 0,
        is_teaching: is_teaching || false,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating designation:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Designations API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
