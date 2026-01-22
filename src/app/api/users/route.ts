import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/client'
import bcrypt from 'bcryptjs'

// GET /api/users - List users (filtered by school)
export async function GET(request: NextRequest) {
    try {
        const supabase = createServerClient()

        const searchParams = request.nextUrl.searchParams
        const schoolId = searchParams.get('school_id')
        const role = searchParams.get('role')
        const search = searchParams.get('search')
        const status = searchParams.get('status')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')

        let query = supabase
            .from('users')
            .select('id, email, first_name, last_name, role, phone, avatar_url, is_active, last_login, created_at, school_id', { count: 'exact' })

        // Filter by school
        if (schoolId) {
            query = query.eq('school_id', schoolId)
        }

        // Filter by role
        if (role && role !== 'all') {
            query = query.eq('role', role)
        }

        // Filter by status
        if (status === 'active') {
            query = query.eq('is_active', true)
        } else if (status === 'inactive') {
            query = query.eq('is_active', false)
        }

        // Search
        if (search) {
            query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`)
        }

        // Pagination
        const from = (page - 1) * limit
        query = query.range(from, from + limit - 1).order('created_at', { ascending: false })

        const { data: users, error, count } = await query

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({
            users,
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil((count || 0) / limit)
            }
        })
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
    try {
        const supabase = createServerClient()
        const body = await request.json()

        const {
            email,
            password,
            first_name,
            last_name,
            role,
            phone,
            school_id
        } = body

        // Validate required fields
        if (!email || !password || !first_name || !role) {
            return NextResponse.json(
                { error: 'Email, password, first name, and role are required' },
                { status: 400 }
            )
        }

        // Validate role
        const validRoles = ['school_admin', 'teacher', 'parent', 'student', 'accountant', 'librarian', 'transport_manager']
        if (!validRoles.includes(role)) {
            return NextResponse.json(
                { error: 'Invalid role' },
                { status: 400 }
            )
        }

        // Check if email already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email.toLowerCase())
            .single()

        if (existingUser) {
            return NextResponse.json(
                { error: 'A user with this email already exists' },
                { status: 400 }
            )
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10)

        // Create user
        const { data: user, error } = await supabase
            .from('users')
            .insert({
                email: email.toLowerCase(),
                password_hash,
                first_name,
                last_name,
                role,
                phone,
                school_id,
                is_active: true
            })
            .select('id, email, first_name, last_name, role, phone, school_id, is_active, created_at')
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            user,
            message: 'User created successfully'
        }, { status: 201 })

    } catch (error) {
        console.error('Create user error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
