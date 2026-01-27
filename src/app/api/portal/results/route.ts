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

// GET /api/portal/results - Get exam results
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
        const examType = searchParams.get('exam_type')
        const academicYear = searchParams.get('academic_year')

        let query = supabase
            .from('exam_results')
            .select(`
                *,
                exams(
                    id, name, type, date, total_marks,
                    subjects(name, code)
                ),
                users(id, first_name, last_name)
            `)
            .eq('school_id', user.school_id)
            .order('created_at', { ascending: false })

        if (studentId) {
            query = query.eq('student_id', studentId)
        } else if (user.role === 'student') {
            query = query.eq('student_id', user.id)
        }

        if (examType && examType !== 'all') {
            query = query.eq('exams.type', examType)
        }

        const { data: results, error } = await query

        if (error) {
            return NextResponse.json({
                results: [],
                summary: {
                    averagePercentage: 0,
                    totalExams: 0,
                    passed: 0,
                    failed: 0
                },
                source: 'empty'
            })
        }

        // Calculate summary
        const totalMarks = results?.reduce((sum, r) => sum + (r.marks_obtained || 0), 0) || 0
        const maxMarks = results?.reduce((sum, r) => sum + (r.total_marks || r.exams?.total_marks || 100), 0) || 1
        const averagePercentage = Math.round((totalMarks / maxMarks) * 100)

        const summary = {
            averagePercentage,
            totalExams: results?.length || 0,
            passed: results?.filter(r => {
                const percentage = ((r.marks_obtained || 0) / (r.total_marks || r.exams?.total_marks || 100)) * 100
                return percentage >= 33 // Pass percentage
            }).length || 0,
            failed: results?.filter(r => {
                const percentage = ((r.marks_obtained || 0) / (r.total_marks || r.exams?.total_marks || 100)) * 100
                return percentage < 33
            }).length || 0
        }

        return NextResponse.json({
            results: results || [],
            summary
        })
    } catch (error) {
        console.error('Portal results error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
