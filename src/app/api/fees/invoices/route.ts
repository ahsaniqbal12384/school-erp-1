// Fee Invoices API Routes
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch invoices
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)
        const schoolId = searchParams.get('school_id')
        const studentId = searchParams.get('student_id')
        const status = searchParams.get('status')
        const month = searchParams.get('month')
        const year = searchParams.get('year')

        if (!schoolId) {
            return NextResponse.json({ error: 'School ID required' }, { status: 400 })
        }

        let query = supabase
            .from('fee_invoices')
            .select(`
                *,
                student:students(id, first_name, last_name, roll_number, class_id,
                    class:classes(id, name, section)
                ),
                items:fee_invoice_items(*)
            `)
            .eq('school_id', schoolId)
            .order('created_at', { ascending: false })

        if (studentId) {
            query = query.eq('student_id', studentId)
        }
        if (status) {
            query = query.eq('status', status)
        }
        if (month && year) {
            query = query.eq('month', parseInt(month)).eq('year', parseInt(year))
        }

        const { data, error } = await query

        if (error) throw error

        return NextResponse.json({ data })
    } catch (error: unknown) {
        console.error('Invoices fetch error:', error)
        const message = error instanceof Error ? error.message : 'Failed to fetch invoices'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// POST - Generate invoices for students
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const body = await request.json()

        const { school_id, student_ids, month, year, due_date, items } = body

        if (!school_id || !student_ids?.length || !month || !year || !items?.length) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const invoices = []

        for (const studentId of student_ids) {
            // Generate invoice number
            const invoiceNo = `INV-${year}${String(month).padStart(2, '0')}-${Date.now().toString().slice(-6)}`
            
            const totalAmount = items.reduce((sum: number, item: { amount: number }) => sum + item.amount, 0)

            // Create invoice
            const { data: invoice, error: invoiceError } = await (supabase
                .from('fee_invoices') as any)
                .insert({
                    school_id,
                    student_id: studentId,
                    invoice_no: invoiceNo,
                    month,
                    year,
                    total_amount: totalAmount,
                    paid_amount: 0,
                    status: 'pending',
                    due_date,
                    generated_at: new Date().toISOString()
                })
                .select()
                .single()

            if (invoiceError) throw invoiceError

            // Create invoice items
            const invoiceItems = items.map((item: { fee_type: string; name: string; amount: number }) => ({
                invoice_id: invoice.id,
                fee_type: item.fee_type,
                description: item.name,
                amount: item.amount
            }))

            const { error: itemsError } = await (supabase
                .from('fee_invoice_items') as any)
                .insert(invoiceItems)

            if (itemsError) throw itemsError

            invoices.push(invoice)
        }

        return NextResponse.json({ data: invoices, count: invoices.length }, { status: 201 })
    } catch (error: unknown) {
        console.error('Invoice generate error:', error)
        const message = error instanceof Error ? error.message : 'Failed to generate invoices'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
