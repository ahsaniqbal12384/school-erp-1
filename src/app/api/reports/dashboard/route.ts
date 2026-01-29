import { NextRequest, NextResponse } from 'next/server'
import { createUntypedClient as createClient } from '@/lib/supabase/server'

// GET - Fetch dashboard summary for a school
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')

    if (!schoolId) {
      return NextResponse.json({ error: 'School ID is required' }, { status: 400 })
    }

    // Get student count
    const { count: studentCount } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true })
      .eq('school_id', schoolId)
      .eq('status', 'active')

    // Get staff count
    const { count: staffCount } = await supabase
      .from('staff')
      .select('*', { count: 'exact', head: true })
      .eq('school_id', schoolId)
      .eq('is_active', true)

    // Get today's attendance
    const today = new Date().toISOString().split('T')[0]
    
    const { data: attendanceData } = await supabase
      .from('attendance')
      .select('status')
      .eq('school_id', schoolId)
      .eq('date', today)

    const presentCount = attendanceData?.filter(a => a.status === 'present').length || 0
    const absentCount = attendanceData?.filter(a => a.status === 'absent').length || 0
    const totalAttendance = attendanceData?.length || 0

    // Get fee collection summary for current month
    const firstDayOfMonth = new Date()
    firstDayOfMonth.setDate(1)
    firstDayOfMonth.setHours(0, 0, 0, 0)

    const { data: feeData } = await supabase
      .from('fee_payments')
      .select('amount')
      .eq('school_id', schoolId)
      .gte('payment_date', firstDayOfMonth.toISOString())

    const monthlyCollection = feeData?.reduce((sum, f) => sum + (f.amount || 0), 0) || 0

    // Get pending fees
    const { data: pendingFees } = await supabase
      .from('fee_invoices')
      .select('total_amount, paid_amount')
      .eq('school_id', schoolId)
      .eq('status', 'pending')

    const totalPendingFees = pendingFees?.reduce(
      (sum, f) => sum + ((f.total_amount || 0) - (f.paid_amount || 0)),
      0
    ) || 0

    // Get library stats
    const { count: totalBooks } = await supabase
      .from('books')
      .select('*', { count: 'exact', head: true })
      .eq('school_id', schoolId)

    const { count: issuedBooks } = await supabase
      .from('book_issues')
      .select('*', { count: 'exact', head: true })
      .eq('school_id', schoolId)
      .eq('status', 'issued')

    const { count: overdueBooks } = await supabase
      .from('book_issues')
      .select('*', { count: 'exact', head: true })
      .eq('school_id', schoolId)
      .eq('status', 'issued')
      .lt('due_date', new Date().toISOString())

    // Get leave requests count
    const { count: pendingLeaves } = await supabase
      .from('leave_applications')
      .select('*', { count: 'exact', head: true })
      .eq('school_id', schoolId)
      .eq('status', 'pending')

    return NextResponse.json({
      students: {
        total: studentCount || 0,
      },
      staff: {
        total: staffCount || 0,
      },
      attendance: {
        total: totalAttendance,
        present: presentCount,
        absent: absentCount,
        percentage: totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0,
      },
      fees: {
        monthlyCollection,
        pendingFees: totalPendingFees,
      },
      library: {
        totalBooks: totalBooks || 0,
        issuedBooks: issuedBooks || 0,
        overdueBooks: overdueBooks || 0,
      },
      hr: {
        pendingLeaves: pendingLeaves || 0,
      },
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
