import { NextRequest, NextResponse } from 'next/server'
import { createUntypedClient as createClient } from '@/lib/supabase/server'

// GET - Fetch attendance reports
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')
    const classId = searchParams.get('classId')
    const studentId = searchParams.get('studentId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const month = searchParams.get('month')
    const year = searchParams.get('year')

    if (!schoolId) {
      return NextResponse.json({ error: 'School ID is required' }, { status: 400 })
    }

    // Build query
    let query = supabase
      .from('attendance')
      .select(`
        *,
        student:students(id, first_name, last_name, admission_no, class:classes(name))
      `)
      .eq('school_id', schoolId)
      .order('date', { ascending: false })

    if (classId) {
      // Get student IDs for the class first
      const { data: classStudents } = await supabase
        .from('students')
        .select('id')
        .eq('class_id', classId)
      
      const studentIds = classStudents?.map((s: { id: string }) => s.id) || []
      if (studentIds.length > 0) {
        query = query.in('student_id', studentIds)
      }
    }

    if (studentId) {
      query = query.eq('student_id', studentId)
    }

    if (startDate) {
      query = query.gte('date', startDate)
    }

    if (endDate) {
      query = query.lte('date', endDate)
    }

    if (month && year) {
      const monthStart = `${year}-${month.padStart(2, '0')}-01`
      const monthEnd = new Date(parseInt(year), parseInt(month), 0).toISOString().split('T')[0]
      query = query.gte('date', monthStart).lte('date', monthEnd)
    }

    const { data, error } = await query.limit(1000)

    if (error) {
      console.error('Error fetching attendance:', error)
      return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 })
    }

    // Calculate summary
    const summary: { total: number; present: number; absent: number; late: number; leave: number; percentage: number } = {
      total: data?.length || 0,
      present: data?.filter((a: { status: string }) => a.status === 'present').length || 0,
      absent: data?.filter((a: { status: string }) => a.status === 'absent').length || 0,
      late: data?.filter((a: { status: string }) => a.status === 'late').length || 0,
      leave: data?.filter((a: { status: string }) => a.status === 'leave').length || 0,
      percentage: 0
    }

    summary.percentage = summary.total > 0 
      ? Math.round((summary.present / summary.total) * 100) 
      : 0

    // Group by student for student-wise report
    const studentWise: Record<string, { present: number; absent: number; total: number; percentage: number }> = {}
    data?.forEach((a: { student_id: string; status: string }) => {
      if (!studentWise[a.student_id]) {
        studentWise[a.student_id] = { present: 0, absent: 0, total: 0, percentage: 0 }
      }
      studentWise[a.student_id].total++
      if (a.status === 'present' || a.status === 'late') {
        studentWise[a.student_id].present++
      } else if (a.status === 'absent') {
        studentWise[a.student_id].absent++
      }
    })

    // Calculate percentages
    Object.values(studentWise).forEach(s => {
      s.percentage = s.total > 0 ? Math.round((s.present / s.total) * 100) : 0
    })

    // Group by date for date-wise report
    const dateWise: Record<string, { present: number; absent: number; total: number }> = {}
    data?.forEach(a => {
      const date = a.date
      if (!dateWise[date]) {
        dateWise[date] = { present: 0, absent: 0, total: 0 }
      }
      dateWise[date].total++
      if (a.status === 'present' || a.status === 'late') {
        dateWise[date].present++
      } else if (a.status === 'absent') {
        dateWise[date].absent++
      }
    })

    return NextResponse.json({
      records: data,
      summary,
      studentWise,
      dateWise,
    })
  } catch (error) {
    console.error('Attendance reports API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
