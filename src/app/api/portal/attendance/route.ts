import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/client'

// Helper to verify auth token
async function verifyAuth(request: NextRequest) {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) return null

    const supabase = createServerClient()
    const { data: session } = await supabase
        .from('user_sessions')
        .select('*, users(*)')
        .eq('token', token)
        .gt('expires_at', new Date().toISOString())
        .single()

    return session
}

// GET /api/portal/attendance - Get attendance records
export async function GET(request: NextRequest) {
    try {
        const session = await verifyAuth(request)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = session.users
        const supabase = createServerClient()

        const searchParams = request.nextUrl.searchParams
        const studentId = searchParams.get('student_id')
        const month = searchParams.get('month')
        const year = searchParams.get('year')

        // Build date range
        const currentDate = new Date()
        const selectedMonth = month ? parseInt(month) - 1 : currentDate.getMonth()
        const selectedYear = year ? parseInt(year) : currentDate.getFullYear()
        
        const startDate = new Date(selectedYear, selectedMonth, 1)
        const endDate = new Date(selectedYear, selectedMonth + 1, 0)

        let query = supabase
            .from('attendance')
            .select(`
                *,
                users(id, first_name, last_name)
            `)
            .eq('school_id', user.school_id)
            .gte('date', startDate.toISOString().split('T')[0])
            .lte('date', endDate.toISOString().split('T')[0])
            .order('date', { ascending: false })

        if (studentId) {
            query = query.eq('user_id', studentId)
        } else if (user.role === 'student') {
            query = query.eq('user_id', user.id)
        }

        const { data: attendance, error } = await query

        if (error) {
            // Return sample data if table doesn't exist
            return NextResponse.json({
                attendance: [],
                summary: {
                    total: 0,
                    present: 0,
                    absent: 0,
                    late: 0,
                    excused: 0,
                    percentage: 0
                },
                source: 'empty'
            })
        }

        // Calculate summary
        const summary = {
            total: attendance?.length || 0,
            present: attendance?.filter(a => a.status === 'present').length || 0,
            absent: attendance?.filter(a => a.status === 'absent').length || 0,
            late: attendance?.filter(a => a.status === 'late').length || 0,
            excused: attendance?.filter(a => a.status === 'excused').length || 0,
            percentage: 0
        }

        if (summary.total > 0) {
            summary.percentage = Math.round(((summary.present + summary.late) / summary.total) * 100)
        }

        return NextResponse.json({
            attendance: attendance || [],
            summary
        })
    } catch (error) {
        console.error('Portal attendance error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
