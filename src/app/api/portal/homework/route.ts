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

// GET /api/portal/homework - Get homework assignments
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
        const status = searchParams.get('status')
        const subject = searchParams.get('subject')

        let query = supabase
            .from('homework')
            .select(`
                *,
                subjects(name, code),
                users!homework_teacher_id_fkey(id, first_name, last_name),
                classes(name)
            `)
            .eq('school_id', user.school_id)
            .order('due_date', { ascending: true })

        if (status === 'pending') {
            query = query.gte('due_date', new Date().toISOString().split('T')[0])
        } else if (status === 'overdue') {
            query = query.lt('due_date', new Date().toISOString().split('T')[0])
        }

        if (subject) {
            query = query.eq('subject_id', subject)
        }

        const { data: homework, error } = await query.limit(50)

        if (error) {
            return NextResponse.json({
                homework: [],
                summary: {
                    pending: 0,
                    submitted: 0,
                    overdue: 0,
                    graded: 0
                },
                source: 'empty'
            })
        }

        // Get submissions for this student
        let submissions: Record<string, unknown> = {}
        if (studentId || user.role === 'student') {
            const { data: subs } = await supabase
                .from('homework_submissions')
                .select('*')
                .eq('student_id', studentId || user.id)

            subs?.forEach(s => {
                submissions[s.homework_id] = s
            })
        }

        // Combine homework with submission status
        const homeworkWithStatus = homework?.map(hw => ({
            ...hw,
            submission: submissions[hw.id] || null,
            status: submissions[hw.id] 
                ? (submissions[hw.id] as { is_graded?: boolean }).is_graded ? 'graded' : 'submitted'
                : new Date(hw.due_date) < new Date() ? 'overdue' : 'pending'
        }))

        // Calculate summary
        const summary = {
            pending: homeworkWithStatus?.filter(h => h.status === 'pending').length || 0,
            submitted: homeworkWithStatus?.filter(h => h.status === 'submitted').length || 0,
            overdue: homeworkWithStatus?.filter(h => h.status === 'overdue').length || 0,
            graded: homeworkWithStatus?.filter(h => h.status === 'graded').length || 0
        }

        return NextResponse.json({
            homework: homeworkWithStatus || [],
            summary
        })
    } catch (error) {
        console.error('Portal homework error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST /api/portal/homework - Submit homework
export async function POST(request: NextRequest) {
    try {
        const session = await verifyAuth(request)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = session.users
        const body = await request.json()
        const { homework_id, content, attachment_url } = body

        if (!homework_id) {
            return NextResponse.json({ error: 'Homework ID is required' }, { status: 400 })
        }

        const supabase = createServerClient()

        // Check if already submitted
        const { data: existing } = await supabase
            .from('homework_submissions')
            .select('id')
            .eq('homework_id', homework_id)
            .eq('student_id', user.id)
            .single()

        let result
        if (existing) {
            // Update existing submission
            result = await supabase
                .from('homework_submissions')
                .update({
                    content,
                    attachment_url,
                    submitted_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', existing.id)
                .select()
                .single()
        } else {
            // Create new submission
            result = await supabase
                .from('homework_submissions')
                .insert({
                    homework_id,
                    student_id: user.id,
                    content,
                    attachment_url,
                    submitted_at: new Date().toISOString()
                })
                .select()
                .single()
        }

        if (result.error) {
            return NextResponse.json({ error: result.error.message }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            submission: result.data
        })
    } catch (error) {
        console.error('Portal homework submission error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
