import { NextRequest, NextResponse } from 'next/server'
import { createUntypedClient as createClient } from '@/lib/supabase/server'

// GET - Fetch fee collection reports
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const classId = searchParams.get('classId')

    if (!schoolId) {
      return NextResponse.json({ error: 'School ID is required' }, { status: 400 })
    }

    // Get fee collection summary
    const { data: summary, error: summaryError } = await supabase
      .from('fee_collection_summary')
      .select('*')
      .eq('school_id', schoolId)
      .order('month', { ascending: false })
      .order('year', { ascending: false })
      .limit(12)

    if (summaryError) {
      console.error('Error fetching fee summary:', summaryError)
    }

    // Get fee defaulters
    const { data: defaulters, error: defaultersError } = await supabase
      .from('fee_defaulters_snapshot')
      .select(`
        *,
        student:students(id, first_name, last_name, admission_no, class:classes(name))
      `)
      .eq('school_id', schoolId)
      .order('total_due', { ascending: false })
      .limit(50)

    if (defaultersError) {
      console.error('Error fetching defaulters:', defaultersError)
    }

    // Get recent payments
    let paymentsQuery = supabase
      .from('fee_payments')
      .select(`
        *,
        invoice:fee_invoices(
          id,
          student:students(first_name, last_name, admission_no, class:classes(name))
        )
      `)
      .eq('school_id', schoolId)
      .order('payment_date', { ascending: false })
      .limit(100)

    if (startDate) {
      paymentsQuery = paymentsQuery.gte('payment_date', startDate)
    }

    if (endDate) {
      paymentsQuery = paymentsQuery.lte('payment_date', endDate)
    }

    const { data: payments, error: paymentsError } = await paymentsQuery

    if (paymentsError) {
      console.error('Error fetching payments:', paymentsError)
    }

    // Calculate totals
    const totalCollection = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0
    const totalDefaultAmount = defaulters?.reduce((sum, d) => sum + (d.total_due || 0), 0) || 0

    return NextResponse.json({
      summary: summary || [],
      defaulters: defaulters || [],
      recentPayments: payments || [],
      totals: {
        collection: totalCollection,
        defaultAmount: totalDefaultAmount,
        defaultersCount: defaulters?.length || 0,
      },
    })
  } catch (error) {
    console.error('Fee reports API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
