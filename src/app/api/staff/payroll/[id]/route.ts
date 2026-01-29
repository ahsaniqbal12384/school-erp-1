import { NextRequest, NextResponse } from 'next/server'
import { createUntypedClient as createClient } from '@/lib/supabase/server'

// PUT - Update payroll record (approve/pay)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params
    const body = await request.json()

    const updateData: Record<string, unknown> = {
      ...body,
      updated_at: new Date().toISOString(),
    }

    // If status is being updated to approved
    if (body.status === 'approved') {
      updateData.approved_by = body.approved_by
      updateData.approved_on = new Date().toISOString()
    }

    // If status is being updated to paid
    if (body.status === 'paid') {
      updateData.paid_on = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('payroll')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating payroll:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Payroll API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
