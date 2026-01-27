// Fee Payments API Routes
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch payments/transactions
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)
        const schoolId = searchParams.get('school_id')
        const studentId = searchParams.get('student_id')
        const invoiceId = searchParams.get('invoice_id')
        const startDate = searchParams.get('start_date')
        const endDate = searchParams.get('end_date')

        if (!schoolId) {
            return NextResponse.json({ error: 'School ID required' }, { status: 400 })
        }

        let query = supabase
            .from('fee_transactions')
            .select(`
                *,
                student:students(id, first_name, last_name, roll_number,
                    class:classes(id, name, section)
                ),
                invoice:fee_invoices(id, invoice_no, month, year, total_amount)
            `)
            .eq('school_id', schoolId)
            .order('payment_date', { ascending: false })

        if (studentId) {
            query = query.eq('student_id', studentId)
        }
        if (invoiceId) {
            query = query.eq('invoice_id', invoiceId)
        }
        if (startDate) {
            query = query.gte('payment_date', startDate)
        }
        if (endDate) {
            query = query.lte('payment_date', endDate)
        }

        const { data, error } = await query

        if (error) throw error

        return NextResponse.json({ data })
    } catch (error: unknown) {
        console.error('Payments fetch error:', error)
        const message = error instanceof Error ? error.message : 'Failed to fetch payments'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// POST - Record a payment
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const body = await request.json()

        const {
            school_id,
            invoice_id,
            student_id,
            amount,
            payment_method,
            transaction_ref,
            bank_name,
            cheque_no,
            remarks,
            received_by
        } = body

        if (!school_id || !invoice_id || !student_id || !amount || !payment_method) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Generate receipt number
        const receiptNo = `RCP-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Date.now().toString().slice(-6)}`

        // Create transaction
        const { data: transaction, error: txError } = await (supabase
            .from('fee_transactions') as any)
            .insert({
                school_id,
                invoice_id,
                student_id,
                receipt_no: receiptNo,
                amount,
                payment_method,
                payment_date: new Date().toISOString().split('T')[0],
                transaction_ref,
                bank_name,
                cheque_no,
                remarks,
                received_by
            })
            .select()
            .single()

        if (txError) throw txError

        // Update invoice paid amount and status
        const { data: invoice } = await (supabase
            .from('fee_invoices') as any)
            .select('total_amount, paid_amount')
            .eq('id', invoice_id)
            .single()

        if (invoice) {
            const newPaidAmount = (invoice.paid_amount || 0) + amount
            let newStatus = 'pending'
            
            if (newPaidAmount >= invoice.total_amount) {
                newStatus = 'paid'
            } else if (newPaidAmount > 0) {
                newStatus = 'partial'
            }

            await (supabase
                .from('fee_invoices') as any)
                .update({
                    paid_amount: newPaidAmount,
                    status: newStatus,
                    paid_at: newStatus === 'paid' ? new Date().toISOString() : null
                })
                .eq('id', invoice_id)
        }

        return NextResponse.json({ data: transaction }, { status: 201 })
    } catch (error: unknown) {
        console.error('Payment record error:', error)
        const message = error instanceof Error ? error.message : 'Failed to record payment'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
