// Attendance Summary/Reports API
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch attendance summary
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)
        const schoolId = searchParams.get('school_id')
        const classId = searchParams.get('class_id')
        const studentId = searchParams.get('student_id')
        const month = searchParams.get('month')
        const year = searchParams.get('year')

        if (!schoolId) {
            return NextResponse.json({ error: 'School ID required' }, { status: 400 })
        }

        // Build date range for the month
        const targetMonth = month ? parseInt(month) : new Date().getMonth() + 1
        const targetYear = year ? parseInt(year) : new Date().getFullYear()
        const startDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-01`
        const endDate = new Date(targetYear, targetMonth, 0).toISOString().split('T')[0]

        let query = (supabase
            .from('attendance') as any)
            .select('student_id, status, date')
            .eq('school_id', schoolId)
            .gte('date', startDate)
            .lte('date', endDate)

        if (classId) {
            query = query.eq('class_id', classId)
        }
        if (studentId) {
            query = query.eq('student_id', studentId)
        }

        const { data: attendance, error } = await query

        if (error) throw error

        // Calculate summary per student
        const studentStats: Record<string, { present: number; absent: number; late: number; excused: number; total: number }> = {}

        attendance?.forEach((record: any) => {
            if (!studentStats[record.student_id]) {
                studentStats[record.student_id] = { present: 0, absent: 0, late: 0, excused: 0, total: 0 }
            }
            studentStats[record.student_id][record.status as keyof typeof studentStats[string]]++
            studentStats[record.student_id].total++
        })

        // Calculate overall stats
        const totalPresent = attendance?.filter((a: any) => a.status === 'present').length || 0
        const totalAbsent = attendance?.filter((a: any) => a.status === 'absent').length || 0
        const totalLate = attendance?.filter((a: any) => a.status === 'late').length || 0
        const totalExcused = attendance?.filter((a: any) => a.status === 'excused').length || 0
        const totalRecords = attendance?.length || 0

        // Get today's attendance
        const today = new Date().toISOString().split('T')[0]
        let todayQuery = (supabase
            .from('attendance') as any)
            .select('status')
            .eq('school_id', schoolId)
            .eq('date', today)

        if (classId) {
            todayQuery = todayQuery.eq('class_id', classId)
        }

        const { data: todayAttendance } = await todayQuery

        const todayPresent = todayAttendance?.filter((a: any) => a.status === 'present').length || 0
        const todayAbsent = todayAttendance?.filter((a: any) => a.status === 'absent').length || 0
        const todayTotal = todayAttendance?.length || 0

        return NextResponse.json({
            period: { month: targetMonth, year: targetYear, startDate, endDate },
            overall: {
                totalRecords,
                present: totalPresent,
                absent: totalAbsent,
                late: totalLate,
                excused: totalExcused,
                attendanceRate: totalRecords > 0 ? ((totalPresent / totalRecords) * 100).toFixed(1) : 0
            },
            today: {
                total: todayTotal,
                present: todayPresent,
                absent: todayAbsent,
                attendanceRate: todayTotal > 0 ? ((todayPresent / todayTotal) * 100).toFixed(1) : 0
            },
            studentStats
        })
    } catch (error: unknown) {
        console.error('Attendance summary error:', error)
        const message = error instanceof Error ? error.message : 'Failed to fetch attendance summary'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
