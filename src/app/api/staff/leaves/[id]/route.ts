import { NextRequest, NextResponse } from 'next/server'
import { createUntypedClient as createClient } from '@/lib/supabase/server'

// PUT - Update leave application (approve/reject)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params
    const body = await request.json()
    const { status, reviewed_by, rejection_reason } = body

    if (!status || !['approved', 'rejected', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid status required: approved, rejected, or cancelled' },
        { status: 400 }
      )
    }

    const updateData: Record<string, unknown> = {
      status,
      reviewed_by,
      reviewed_on: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (status === 'rejected' && rejection_reason) {
      updateData.rejection_reason = rejection_reason
    }

    const { data, error } = await supabase
      .from('leave_applications')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating leave application:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // If approved, update leave balance
    if (status === 'approved') {
      const leaveApp = data
      
      // Get the current year
      const currentYear = new Date().getFullYear().toString()

      // Update leave balance
      const { error: balanceError } = await supabase
        .from('staff_leave_balance')
        .update({
          used_days: supabase.rpc('increment_used_days', {
            p_staff_id: leaveApp.staff_id,
            p_leave_type_id: leaveApp.leave_type_id,
            p_days: leaveApp.total_days,
          }),
        })
        .eq('staff_id', leaveApp.staff_id)
        .eq('leave_type_id', leaveApp.leave_type_id)
        .eq('academic_year', currentYear)

      if (balanceError) {
        console.error('Error updating leave balance:', balanceError)
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Leave API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
