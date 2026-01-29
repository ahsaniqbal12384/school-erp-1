import { NextRequest, NextResponse } from 'next/server'
import { createUntypedClient as createClient } from '@/lib/supabase/server'

// GET - Fetch all books for a school
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')
    const categoryId = searchParams.get('categoryId')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    if (!schoolId) {
      return NextResponse.json({ error: 'School ID is required' }, { status: 400 })
    }

    let query = supabase
      .from('books')
      .select(`
        *,
        category:book_categories(id, name),
        location:book_locations(id, name, shelf_number),
        publisher:publishers(id, name),
        book_authors(
          author:authors(id, name)
        ),
        copies:book_copies(id, accession_number, status)
      `)
      .eq('school_id', schoolId)
      .order('title')

    if (categoryId && categoryId !== 'all') {
      query = query.eq('category_id', categoryId)
    }

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,isbn.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching books:', error)
      return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Books API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create a new book
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      school_id,
      isbn,
      title,
      subtitle,
      edition,
      category_id,
      publisher_id,
      location_id,
      publication_year,
      pages,
      language,
      description,
      cover_image_url,
      total_copies,
      price,
      author_ids,
    } = body

    if (!school_id || !title) {
      return NextResponse.json(
        { error: 'Required fields: school_id, title' },
        { status: 400 }
      )
    }

    // Start a transaction - create book first
    const { data: book, error: bookError } = await supabase
      .from('books')
      .insert({
        school_id,
        isbn,
        title,
        subtitle,
        edition,
        category_id,
        publisher_id,
        location_id,
        publication_year,
        pages,
        language: language || 'English',
        description,
        cover_image_url,
        total_copies: total_copies || 1,
        available_copies: total_copies || 1,
        price: price || 0,
        status: 'available',
      })
      .select()
      .single()

    if (bookError) {
      console.error('Error creating book:', bookError)
      return NextResponse.json({ error: bookError.message }, { status: 500 })
    }

    // Add author associations if provided
    if (author_ids && author_ids.length > 0) {
      const bookAuthors = author_ids.map((authorId: string, index: number) => ({
        book_id: book.id,
        author_id: authorId,
        is_primary: index === 0,
      }))

      const { error: authorError } = await supabase
        .from('book_authors')
        .insert(bookAuthors)

      if (authorError) {
        console.error('Error adding book authors:', authorError)
      }
    }

    // Create book copies
    if (total_copies && total_copies > 0) {
      const copies = Array.from({ length: total_copies }, (_, i) => ({
        school_id,
        book_id: book.id,
        accession_number: `${book.id.slice(0, 8)}-${(i + 1).toString().padStart(3, '0')}`,
        status: 'available',
        condition: 'good',
      }))

      const { error: copyError } = await supabase
        .from('book_copies')
        .insert(copies)

      if (copyError) {
        console.error('Error creating book copies:', copyError)
      }
    }

    return NextResponse.json(book, { status: 201 })
  } catch (error) {
    console.error('Books API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
