import { NextRequest, NextResponse } from 'next/server'
import { createUntypedClient as createClient } from '@/lib/supabase/server'

// GET - Fetch analytics data
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')
    const type = searchParams.get('type') // daily, monthly, yearly
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!schoolId) {
      return NextResponse.json({ error: 'School ID is required' }, { status: 400 })
    }

    let tableName = 'daily_analytics'
    if (type === 'monthly') tableName = 'monthly_analytics'
    if (type === 'yearly') tableName = 'yearly_analytics'

    let query = supabase
      .from(tableName)
      .select('*')
      .eq('school_id', schoolId)
      .order('date', { ascending: false })

    if (startDate) {
      query = query.gte('date', startDate)
    }

    if (endDate) {
      query = query.lte('date', endDate)
    }

    // Limit to last 30 days/months/years by default
    query = query.limit(30)

    const { data, error } = await query

    if (error) {
      console.error('Error fetching analytics:', error)
      return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Generate analytics snapshot
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { school_id, type, date } = body

    if (!school_id || !type) {
      return NextResponse.json(
        { error: 'Required fields: school_id, type' },
        { status: 400 }
      )
    }

    const targetDate = date ? new Date(date) : new Date()
    
    // Get student count
    const { count: totalStudents } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true })
      .eq('school_id', school_id)
      .eq('status', 'active')

    // Get attendance data
    const { data: attendanceData } = await supabase
      .from('attendance')
      .select('status')
      .eq('school_id', school_id)
      .eq('date', targetDate.toISOString().split('T')[0])

    const presentStudents = attendanceData?.filter(a => a.status === 'present').length || 0
    const absentStudents = attendanceData?.filter(a => a.status === 'absent').length || 0

    // Get fee collection
    const { data: feeData } = await supabase
      .from('fee_payments')
      .select('amount')
      .eq('school_id', school_id)
      .gte('payment_date', targetDate.toISOString().split('T')[0])
      .lt('payment_date', new Date(targetDate.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0])

    const feeCollection = feeData?.reduce((sum, f) => sum + (f.amount || 0), 0) || 0

    // Get library stats
    const { count: booksIssued } = await supabase
      .from('book_issues')
      .select('*', { count: 'exact', head: true })
      .eq('school_id', school_id)
      .gte('issue_date', targetDate.toISOString().split('T')[0])
      .lt('issue_date', new Date(targetDate.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0])

    const { count: booksReturned } = await supabase
      .from('book_issues')
      .select('*', { count: 'exact', head: true })
      .eq('school_id', school_id)
      .eq('status', 'returned')
      .gte('return_date', targetDate.toISOString().split('T')[0])
      .lt('return_date', new Date(targetDate.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0])

    const analyticsData = {
      school_id,
      date: targetDate.toISOString().split('T')[0],
      total_students: totalStudents || 0,
      present_students: presentStudents,
      absent_students: absentStudents,
      attendance_percentage: totalStudents && totalStudents > 0 
        ? Math.round((presentStudents / totalStudents) * 100) 
        : 0,
      fee_collection: feeCollection,
      books_issued: booksIssued || 0,
      books_returned: booksReturned || 0,
    }

    // Upsert to daily_analytics
    const { data, error } = await supabase
      .from('daily_analytics')
      .upsert(analyticsData, {
        onConflict: 'school_id,date',
      })
      .select()
      .single()

    if (error) {
      console.error('Error generating analytics:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
