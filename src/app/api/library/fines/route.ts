import { NextRequest, NextResponse } from 'next/server'
import { createUntypedClient as createClient } from '@/lib/supabase/server'

// GET - Fetch library fines
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')
    const memberId = searchParams.get('memberId')
    const status = searchParams.get('status')

    if (!schoolId) {
      return NextResponse.json({ error: 'School ID is required' }, { status: 400 })
    }

    let query = supabase
      .from('library_fines')
      .select(`
        *,
        member:library_members(
          id, 
          membership_no, 
          member_type,
          student:students(first_name, last_name),
          staff:staff(first_name, last_name)
        ),
        issue:book_issues(
          id,
          book_copy:book_copies(
            book:books(title)
          )
        )
      `)
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false })

    if (memberId) {
      query = query.eq('member_id', memberId)
    }

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching fines:', error)
      return NextResponse.json({ error: 'Failed to fetch fines' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Fines API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Pay a fine
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      fine_id,
      amount_paid,
      payment_method,
      collected_by,
      remarks,
    } = body

    if (!fine_id || !amount_paid) {
      return NextResponse.json(
        { error: 'Required fields: fine_id, amount_paid' },
        { status: 400 }
      )
    }

    // Get fine details
    const { data: fine, error: fineError } = await supabase
      .from('library_fines')
      .select('*')
      .eq('id', fine_id)
      .single()

    if (fineError || !fine) {
      return NextResponse.json({ error: 'Fine not found' }, { status: 404 })
    }

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('fine_payments')
      .insert({
        school_id: fine.school_id,
        fine_id,
        amount: amount_paid,
        payment_method: payment_method || 'cash',
        payment_date: new Date().toISOString(),
        collected_by,
        remarks,
      })
      .select()
      .single()

    if (paymentError) {
      console.error('Error creating payment:', paymentError)
      return NextResponse.json({ error: paymentError.message }, { status: 500 })
    }

    // Update fine status
    const newPaidAmount = (fine.paid_amount || 0) + amount_paid
    const newStatus = newPaidAmount >= fine.amount ? 'paid' : 'partial'

    await supabase
      .from('library_fines')
      .update({
        paid_amount: newPaidAmount,
        status: newStatus,
        paid_date: newStatus === 'paid' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', fine_id)

    // Update member's total fines paid
    const currentMember = await supabase
      .from('library_members')
      .select('total_fines_paid')
      .eq('id', fine.member_id)
      .single()
    
    await supabase
      .from('library_members')
      .update({
        total_fines_paid: (currentMember.data?.total_fines_paid || 0) + amount_paid
      })
      .eq('id', fine.member_id)

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    console.error('Fine payment API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
