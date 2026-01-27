import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/client'

// GET /api/tickets - Get all support tickets
export async function GET(request: NextRequest) {
    try {
        const supabase = createServerClient()

        const searchParams = request.nextUrl.searchParams
        const status = searchParams.get('status')
        const priority = searchParams.get('priority')
        const search = searchParams.get('search')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')

        let query = supabase
            .from('support_tickets')
            .select(`
                *,
                schools(id, name, slug),
                users(id, first_name, last_name, email)
            `, { count: 'exact' })

        // Apply filters
        if (status && status !== 'all') {
            query = query.eq('status', status)
        }

        if (priority && priority !== 'all') {
            query = query.eq('priority', priority)
        }

        if (search) {
            query = query.or(`subject.ilike.%${search}%,description.ilike.%${search}%`)
        }

        // Pagination
        const from = (page - 1) * limit
        const to = from + limit - 1
        query = query.range(from, to).order('created_at', { ascending: false })

        const { data: tickets, error, count } = await query

        if (error) {
            // If table doesn't exist, return empty array
            if (error.code === '42P01') {
                return NextResponse.json({
                    tickets: [],
                    metrics: {
                        total: 0,
                        open: 0,
                        inProgress: 0,
                        resolved: 0,
                        avgResponseTime: '0h'
                    },
                    pagination: { page, limit, total: 0, totalPages: 0 }
                })
            }
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Calculate metrics
        const { data: allTickets } = await supabase
            .from('support_tickets')
            .select('status, priority')

        const metrics = {
            total: allTickets?.length || 0,
            open: allTickets?.filter(t => t.status === 'open').length || 0,
            inProgress: allTickets?.filter(t => t.status === 'in_progress').length || 0,
            resolved: allTickets?.filter(t => t.status === 'resolved' || t.status === 'closed').length || 0,
            avgResponseTime: '2.5h' // Placeholder - would need proper calculation
        }

        return NextResponse.json({
            tickets,
            metrics,
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil((count || 0) / limit)
            }
        })
    } catch (error) {
        console.error('Tickets fetch error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST /api/tickets - Create a new support ticket
export async function POST(request: NextRequest) {
    try {
        const supabase = createServerClient()
        const body = await request.json()

        const { school_id, user_id, subject, description, priority = 'medium', category } = body

        if (!subject || !description) {
            return NextResponse.json(
                { error: 'Subject and description are required' },
                { status: 400 }
            )
        }

        // Generate ticket number
        const ticketNumber = `TKT-${Date.now().toString(36).toUpperCase()}`

        const { data: ticket, error } = await supabase
            .from('support_tickets')
            .insert({
                ticket_number: ticketNumber,
                school_id,
                user_id,
                subject,
                description,
                priority,
                category: category || 'general',
                status: 'open',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            ticket
        })
    } catch (error) {
        console.error('Ticket creation error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// PATCH /api/tickets - Update ticket status or add response
export async function PATCH(request: NextRequest) {
    try {
        const supabase = createServerClient()
        const body = await request.json()

        const { ticket_id, status, response, assigned_to } = body

        if (!ticket_id) {
            return NextResponse.json(
                { error: 'Ticket ID is required' },
                { status: 400 }
            )
        }

        const updates: Record<string, unknown> = {
            updated_at: new Date().toISOString()
        }

        if (status) updates.status = status
        if (assigned_to) updates.assigned_to = assigned_to

        const { data: ticket, error } = await supabase
            .from('support_tickets')
            .update(updates)
            .eq('id', ticket_id)
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Add response to ticket_responses table if response provided
        if (response) {
            try {
                await supabase
                    .from('ticket_responses')
                    .insert({
                        ticket_id,
                        message: response,
                        is_staff_reply: true,
                        created_at: new Date().toISOString()
                    })
            } catch {
                // Table might not exist
            }
        }

        return NextResponse.json({
            success: true,
            ticket
        })
    } catch (error) {
        console.error('Ticket update error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
