import { NextRequest, NextResponse } from 'next/server'
import { createUntypedClient as createClient } from '@/lib/supabase/server'

// GET - Fetch book issues
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
      .from('book_issues')
      .select(`
        *,
        member:library_members(
          id, 
          membership_no, 
          member_type,
          student:students(first_name, last_name, admission_no),
          staff:staff(first_name, last_name, employee_id)
        ),
        book_copy:book_copies(
          id, 
          accession_number,
          book:books(id, title, isbn)
        )
      `)
      .eq('school_id', schoolId)
      .order('issue_date', { ascending: false })

    if (memberId) {
      query = query.eq('member_id', memberId)
    }

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching book issues:', error)
      return NextResponse.json({ error: 'Failed to fetch book issues' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Book issues API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Issue a book
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      school_id,
      member_id,
      book_copy_id,
      due_date,
      issued_by,
      remarks,
    } = body

    if (!school_id || !member_id || !book_copy_id) {
      return NextResponse.json(
        { error: 'Required fields: school_id, member_id, book_copy_id' },
        { status: 400 }
      )
    }

    // Check if member can issue more books
    const { data: member, error: memberError } = await supabase
      .from('library_members')
      .select('max_books, current_books_count, max_days, status')
      .eq('id', member_id)
      .single()

    if (memberError || !member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    if (member.status !== 'active') {
      return NextResponse.json(
        { error: 'Member is not active' },
        { status: 400 }
      )
    }

    if (member.current_books_count >= member.max_books) {
      return NextResponse.json(
        { error: `Member has reached maximum book limit (${member.max_books})` },
        { status: 400 }
      )
    }

    // Check if book copy is available
    const { data: bookCopy, error: copyError } = await supabase
      .from('book_copies')
      .select('status, book_id')
      .eq('id', book_copy_id)
      .single()

    if (copyError || !bookCopy) {
      return NextResponse.json({ error: 'Book copy not found' }, { status: 404 })
    }

    if (bookCopy.status !== 'available') {
      return NextResponse.json(
        { error: 'Book copy is not available' },
        { status: 400 }
      )
    }

    // Calculate due date if not provided
    const issueDate = new Date()
    const calculatedDueDate = due_date
      ? new Date(due_date)
      : new Date(issueDate.getTime() + member.max_days * 24 * 60 * 60 * 1000)

    // Create book issue record
    const { data: issue, error: issueError } = await supabase
      .from('book_issues')
      .insert({
        school_id,
        member_id,
        book_copy_id,
        issue_date: issueDate.toISOString(),
        due_date: calculatedDueDate.toISOString(),
        issued_by,
        remarks,
        status: 'issued',
      })
      .select()
      .single()

    if (issueError) {
      console.error('Error creating book issue:', issueError)
      return NextResponse.json({ error: issueError.message }, { status: 500 })
    }

    // Update book copy status
    await supabase
      .from('book_copies')
      .update({ status: 'issued' })
      .eq('id', book_copy_id)

    // Update book available copies
    await supabase.rpc('decrement_available_copies', { book_id: bookCopy.book_id })

    // Update member's current book count
    const currentMember = await supabase
      .from('library_members')
      .select('current_books_count, total_books_issued')
      .eq('id', member_id)
      .single()
    
    await supabase
      .from('library_members')
      .update({ 
        current_books_count: (currentMember.data?.current_books_count || 0) + 1,
        total_books_issued: (currentMember.data?.total_books_issued || 0) + 1
      })
      .eq('id', member_id)

    return NextResponse.json(issue, { status: 201 })
  } catch (error) {
    console.error('Book issues API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
