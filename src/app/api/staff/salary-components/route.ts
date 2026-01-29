import { NextRequest, NextResponse } from 'next/server'
import { createUntypedClient as createClient } from '@/lib/supabase/server'

// GET - Fetch salary components for a school
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')
    const type = searchParams.get('type') // 'earning' or 'deduction'

    if (!schoolId) {
      return NextResponse.json({ error: 'School ID is required' }, { status: 400 })
    }

    let query = supabase
      .from('salary_components')
      .select('*')
      .eq('school_id', schoolId)
      .eq('is_active', true)
      .order('type')
      .order('name')

    if (type && ['earning', 'deduction'].includes(type)) {
      query = query.eq('type', type)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching salary components:', error)
      return NextResponse.json({ error: 'Failed to fetch salary components' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Salary components API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create a new salary component
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      school_id,
      name,
      code,
      type,
      calculation_type,
      percentage_of,
      default_value,
      is_taxable,
    } = body

    if (!school_id || !name || !code || !type || !calculation_type) {
      return NextResponse.json(
        { error: 'Required fields: school_id, name, code, type, calculation_type' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('salary_components')
      .insert({
        school_id,
        name,
        code,
        type,
        calculation_type,
        percentage_of,
        default_value: default_value || 0,
        is_taxable: is_taxable ?? false,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating salary component:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Salary components API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
