import { NextRequest, NextResponse } from 'next/server'
import { createUntypedClient as createClient } from '@/lib/supabase/server'

// GET - Fetch leave types for a school
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')

    if (!schoolId) {
      return NextResponse.json({ error: 'School ID is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('leave_types')
      .select('*')
      .eq('school_id', schoolId)
      .eq('is_active', true)
      .order('name')

    if (error) {
      console.error('Error fetching leave types:', error)
      return NextResponse.json({ error: 'Failed to fetch leave types' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Leave types API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create a new leave type
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      school_id,
      name,
      code,
      description,
      days_allowed,
      is_paid,
      is_carry_forward,
      max_carry_forward,
      requires_document,
    } = body

    if (!school_id || !name || !code) {
      return NextResponse.json(
        { error: 'Required fields: school_id, name, code' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('leave_types')
      .insert({
        school_id,
        name,
        code,
        description,
        days_allowed: days_allowed || 0,
        is_paid: is_paid ?? true,
        is_carry_forward: is_carry_forward ?? false,
        max_carry_forward: max_carry_forward || 0,
        requires_document: requires_document ?? false,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating leave type:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Leave types API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
