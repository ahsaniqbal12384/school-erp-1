import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/client'

// GET /api/schools - List all schools (Super Admin only)
export async function GET(request: NextRequest) {
    try {
        const supabase = createServerClient()

        // Get query parameters
        const searchParams = request.nextUrl.searchParams
        const status = searchParams.get('status')
        const plan = searchParams.get('plan')
        const search = searchParams.get('search')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')

        // Build query
        let query = supabase
            .from('schools')
            .select('*, school_settings(*), school_modules(*)', { count: 'exact' })

        // Apply filters
        if (status && status !== 'all') {
            query = query.eq('subscription_status', status)
        }

        if (plan && plan !== 'all') {
            query = query.eq('subscription_plan', plan)
        }

        if (search) {
            query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%,email.ilike.%${search}%`)
        }

        // Apply pagination
        const from = (page - 1) * limit
        const to = from + limit - 1
        query = query.range(from, to).order('created_at', { ascending: false })

        const { data: schools, error, count } = await query

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({
            schools,
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

// POST /api/schools - Create new school (Super Admin only)
export async function POST(request: NextRequest) {
    try {
        const supabase = createServerClient()
        const body = await request.json()

        const {
            name,
            slug,
            email,
            phone,
            city,
            address,
            principal_name,
            subscription_plan = 'basic',
            enabled_modules = []
        } = body

        // Validate required fields
        if (!name || !slug || !email) {
            return NextResponse.json(
                { error: 'Name, slug, and email are required' },
                { status: 400 }
            )
        }

        // Check if slug is already taken
        const { data: existingSchool } = await supabase
            .from('schools')
            .select('id')
            .eq('slug', slug)
            .single()

        if (existingSchool) {
            return NextResponse.json(
                { error: 'This URL slug is already taken' },
                { status: 400 }
            )
        }

        // Get plan details
        const planLimits = {
            basic: { max_students: 100, max_staff: 20 },
            standard: { max_students: 500, max_staff: 50 },
            premium: { max_students: 2000, max_staff: 200 },
            enterprise: { max_students: -1, max_staff: -1 }
        }

        const limits = planLimits[subscription_plan as keyof typeof planLimits] || planLimits.basic

        // Create school
        const { data: school, error: schoolError } = await supabase
            .from('schools')
            .insert({
                name,
                slug,
                email,
                phone,
                city,
                address,
                principal_name,
                subscription_plan,
                subscription_status: 'trial',
                subscription_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                max_students: limits.max_students,
                max_staff: limits.max_staff,
                is_active: true
            })
            .select()
            .single()

        if (schoolError) {
            return NextResponse.json({ error: schoolError.message }, { status: 500 })
        }

        // Create default settings
        await supabase
            .from('school_settings')
            .insert({
                school_id: school.id
            })

        // Create default modules based on plan
        const defaultModules = {
            basic: ['students', 'staff', 'fees', 'attendance', 'communications'],
            standard: ['students', 'staff', 'fees', 'attendance', 'communications', 'exams', 'admissions', 'homework', 'reports'],
            premium: ['students', 'staff', 'fees', 'attendance', 'communications', 'exams', 'admissions', 'homework', 'reports', 'transport', 'library', 'timetable'],
            enterprise: ['students', 'staff', 'fees', 'attendance', 'communications', 'exams', 'admissions', 'homework', 'reports', 'transport', 'library', 'timetable', 'inventory', 'hostel', 'cafeteria']
        }

        const modules = enabled_modules.length > 0
            ? enabled_modules
            : defaultModules[subscription_plan as keyof typeof defaultModules] || defaultModules.basic

        // Insert modules
        const moduleInserts = modules.map((moduleName: string) => ({
            school_id: school.id,
            module_name: moduleName,
            is_enabled: true
        }))

        await supabase.from('school_modules').insert(moduleInserts)

        const domain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'localhost:3000'
        return NextResponse.json({
            success: true,
            school,
            message: `School created successfully! Access URL: ${slug}.${domain}`
        }, { status: 201 })

    } catch (error) {
        console.error('Create school error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
