import { NextRequest, NextResponse } from 'next/server'
import { createUntypedClient as createClient } from '@/lib/supabase/server'

// PUT - Return a book
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params
    const body = await request.json()
    const { returned_by, condition_on_return, remarks, fine_amount } = body

    // Fetch the issue record
    const { data: issue, error: issueError } = await supabase
      .from('book_issues')
      .select(`
        *,
        book_copy:book_copies(id, book_id)
      `)
      .eq('id', id)
      .single()

    if (issueError || !issue) {
      return NextResponse.json({ error: 'Book issue not found' }, { status: 404 })
    }

    if (issue.status === 'returned') {
      return NextResponse.json(
        { error: 'Book has already been returned' },
        { status: 400 }
      )
    }

    const returnDate = new Date()
    const dueDate = new Date(issue.due_date)
    const isOverdue = returnDate > dueDate

    // Calculate overdue days
    let overdueDays = 0
    if (isOverdue) {
      const diffTime = returnDate.getTime() - dueDate.getTime()
      overdueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    // Update issue record
    const { data: updatedIssue, error: updateError } = await supabase
      .from('book_issues')
      .update({
        return_date: returnDate.toISOString(),
        returned_by,
        condition_on_return: condition_on_return || 'good',
        remarks,
        status: 'returned',
        fine_amount: fine_amount || 0,
        updated_at: returnDate.toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating book issue:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Update book copy status
    await supabase
      .from('book_copies')
      .update({ 
        status: 'available',
        condition: condition_on_return || 'good'
      })
      .eq('id', issue.book_copy_id)

    // Update book available copies
    if (issue.book_copy) {
      await supabase.rpc('increment_available_copies', { book_id: issue.book_copy.book_id })
    }

    // Update member's current book count
    const currentMember = await supabase
      .from('library_members')
      .select('current_books_count')
      .eq('id', issue.member_id)
      .single()
    
    await supabase
      .from('library_members')
      .update({ 
        current_books_count: Math.max(0, (currentMember.data?.current_books_count || 1) - 1)
      })
      .eq('id', issue.member_id)

    // Create fine record if applicable
    if (fine_amount && fine_amount > 0) {
      await supabase
        .from('library_fines')
        .insert({
          school_id: issue.school_id,
          member_id: issue.member_id,
          issue_id: issue.id,
          fine_type: 'overdue',
          amount: fine_amount,
          overdue_days: overdueDays,
          status: 'pending',
        })
    }

    return NextResponse.json({
      ...updatedIssue,
      overdue_days: overdueDays,
      is_overdue: isOverdue,
    })
  } catch (error) {
    console.error('Book return API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
