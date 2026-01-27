// Fee Dashboard/Summary API
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch fee summary/dashboard data
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)
        const schoolId = searchParams.get('school_id')
        const month = searchParams.get('month') || new Date().getMonth() + 1
        const year = searchParams.get('year') || new Date().getFullYear()

        if (!schoolId) {
            return NextResponse.json({ error: 'School ID required' }, { status: 400 })
        }

        // Get current month invoices summary
        const { data: invoices } = await (supabase
            .from('fee_invoices') as any)
            .select('total_amount, paid_amount, status')
            .eq('school_id', schoolId)
            .eq('month', month)
            .eq('year', year)

        // Get overdue invoices
        const today = new Date().toISOString().split('T')[0]
        const { data: overdueInvoices } = await (supabase
            .from('fee_invoices') as any)
            .select('id, total_amount, paid_amount')
            .eq('school_id', schoolId)
            .lt('due_date', today)
            .neq('status', 'paid')

        // Get recent payments
        const { data: recentPayments } = await (supabase
            .from('fee_transactions') as any)
            .select(`
                *,
                student:students(first_name, last_name, roll_number)
            `)
            .eq('school_id', schoolId)
            .order('payment_date', { ascending: false })
            .limit(10)

        // Get today's collection
        const { data: todayPayments } = await (supabase
            .from('fee_transactions') as any)
            .select('amount')
            .eq('school_id', schoolId)
            .eq('payment_date', today)

        // Calculate summary
        const totalInvoiced = invoices?.reduce((sum: number, inv: any) => sum + (inv.total_amount || 0), 0) || 0
        const totalCollected = invoices?.reduce((sum: number, inv: any) => sum + (inv.paid_amount || 0), 0) || 0
        const pendingAmount = totalInvoiced - totalCollected
        const overdueAmount = overdueInvoices?.reduce((sum: number, inv: any) => 
            sum + ((inv.total_amount || 0) - (inv.paid_amount || 0)), 0) || 0
        const todayCollection = todayPayments?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0

        const paidCount = invoices?.filter((i: any) => i.status === 'paid').length || 0
        const pendingCount = invoices?.filter((i: any) => i.status === 'pending').length || 0
        const partialCount = invoices?.filter((i: any) => i.status === 'partial').length || 0
        const overdueCount = overdueInvoices?.length || 0

        return NextResponse.json({
            summary: {
                totalInvoiced,
                totalCollected,
                pendingAmount,
                overdueAmount,
                todayCollection,
                collectionRate: totalInvoiced > 0 ? ((totalCollected / totalInvoiced) * 100).toFixed(1) : 0
            },
            counts: {
                paid: paidCount,
                pending: pendingCount,
                partial: partialCount,
                overdue: overdueCount,
                total: invoices?.length || 0
            },
            recentPayments
        })
    } catch (error: unknown) {
        console.error('Fee summary fetch error:', error)
        const message = error instanceof Error ? error.message : 'Failed to fetch fee summary'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
