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

// GET /api/portal/fees - Get fee records
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

        let query = supabase
            .from('fee_payments')
            .select(`
                *,
                fee_types(name, amount, frequency),
                users(id, first_name, last_name)
            `)
            .eq('school_id', user.school_id)
            .order('due_date', { ascending: false })

        if (studentId) {
            query = query.eq('student_id', studentId)
        } else if (user.role === 'student') {
            query = query.eq('student_id', user.id)
        }

        if (status && status !== 'all') {
            query = query.eq('status', status)
        }

        const { data: fees, error } = await query

        if (error) {
            return NextResponse.json({
                fees: [],
                summary: {
                    totalPending: 0,
                    totalPaid: 0,
                    totalOverdue: 0
                },
                source: 'empty'
            })
        }

        // Calculate summary
        const summary = {
            totalPending: fees?.filter(f => f.status === 'pending').reduce((sum, f) => sum + (f.amount || 0), 0) || 0,
            totalPaid: fees?.filter(f => f.status === 'paid').reduce((sum, f) => sum + (f.amount || 0), 0) || 0,
            totalOverdue: fees?.filter(f => f.status === 'overdue').reduce((sum, f) => sum + (f.amount || 0), 0) || 0
        }

        return NextResponse.json({
            fees: fees || [],
            summary
        })
    } catch (error) {
        console.error('Portal fees error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST /api/portal/fees - Record a fee payment
export async function POST(request: NextRequest) {
    try {
        const session = await verifyAuth(request)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { fee_id, payment_method, transaction_id } = body

        if (!fee_id) {
            return NextResponse.json({ error: 'Fee ID is required' }, { status: 400 })
        }

        const supabase = createServerClient()

        // Update fee payment status
        const { data: payment, error } = await supabase
            .from('fee_payments')
            .update({
                status: 'paid',
                paid_at: new Date().toISOString(),
                payment_method: payment_method || 'online',
                transaction_id,
                updated_at: new Date().toISOString()
            })
            .eq('id', fee_id)
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            payment
        })
    } catch (error) {
        console.error('Portal fee payment error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
