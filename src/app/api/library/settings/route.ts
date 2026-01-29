import { NextRequest, NextResponse } from 'next/server'
import { createUntypedClient as createClient } from '@/lib/supabase/server'

// GET - Fetch library settings for a school
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')

    if (!schoolId) {
      return NextResponse.json({ error: 'School ID is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('library_settings')
      .select('*')
      .eq('school_id', schoolId)
      .single()

    if (error) {
      // If no settings found, return defaults
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          school_id: schoolId,
          fine_per_day: 10,
          max_fine_amount: 500,
          reservation_days: 3,
          max_reservations: 2,
          max_renewals: 2,
          allow_online_reservation: true,
          send_due_reminders: true,
          reminder_days_before: 2,
          working_hours_start: '08:00',
          working_hours_end: '17:00',
          working_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        })
      }
      console.error('Error fetching library settings:', error)
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Library settings API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update library settings
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { school_id, ...settings } = body

    if (!school_id) {
      return NextResponse.json(
        { error: 'school_id is required' },
        { status: 400 }
      )
    }

    // Upsert settings
    const { data, error } = await supabase
      .from('library_settings')
      .upsert({
        school_id,
        ...settings,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error updating library settings:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Library settings API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
