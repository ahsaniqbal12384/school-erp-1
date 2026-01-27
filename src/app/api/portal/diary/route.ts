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

// GET /api/portal/diary - Get class diary entries
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
        const date = searchParams.get('date')

        let query = supabase
            .from('class_diary')
            .select(`
                *,
                subjects(name, code),
                users!class_diary_teacher_id_fkey(id, first_name, last_name),
                classes(name)
            `)
            .eq('school_id', user.school_id)
            .order('date', { ascending: false })

        if (date) {
            query = query.eq('date', date)
        } else {
            // Default to last 7 days
            const weekAgo = new Date()
            weekAgo.setDate(weekAgo.getDate() - 7)
            query = query.gte('date', weekAgo.toISOString().split('T')[0])
        }

        const { data: diary, error } = await query.limit(50)

        if (error) {
            return NextResponse.json({
                diary: [],
                source: 'empty'
            })
        }

        // Group by date
        const groupedDiary: Record<string, typeof diary> = {}
        diary?.forEach(entry => {
            const dateKey = entry.date
            if (!groupedDiary[dateKey]) {
                groupedDiary[dateKey] = []
            }
            groupedDiary[dateKey].push(entry)
        })

        return NextResponse.json({
            diary: diary || [],
            grouped: groupedDiary
        })
    } catch (error) {
        console.error('Portal diary error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
