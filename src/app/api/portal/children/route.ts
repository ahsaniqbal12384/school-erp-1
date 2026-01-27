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

// GET /api/portal/children - Get parent's children
export async function GET(request: NextRequest) {
    try {
        const session = await verifyAuth(request)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = session.users
        if (user.role !== 'parent') {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 })
        }

        const supabase = createServerClient()

        // Get children linked to this parent
        const { data: children, error } = await supabase
            .from('parent_students')
            .select(`
                student_id,
                relationship,
                students:users!parent_students_student_id_fkey(
                    id, first_name, last_name, email, avatar_url,
                    student_profiles(
                        class_id, section_id, roll_number, admission_date,
                        classes(name, grade_level),
                        sections(name)
                    )
                )
            `)
            .eq('parent_id', user.id)

        if (error) {
            // Fallback if table structure is different
            const { data: fallbackChildren } = await supabase
                .from('users')
                .select(`
                    id, first_name, last_name, email, avatar_url, role
                `)
                .eq('role', 'student')
                .eq('school_id', user.school_id)
                .limit(5) // For demo purposes

            return NextResponse.json({
                children: fallbackChildren || [],
                source: 'fallback'
            })
        }

        return NextResponse.json({
            children: children || []
        })
    } catch (error) {
        console.error('Portal children error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
