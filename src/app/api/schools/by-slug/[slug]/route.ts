import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/client'

// GET /api/schools/by-slug/[slug] - Get school by slug (for subdomain detection)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const supabase = createServerClient()
        const { slug } = await params

        if (!slug) {
            return NextResponse.json(
                { error: 'School slug is required' },
                { status: 400 }
            )
        }

        // Fetch school by slug
        const { data: school, error } = await supabase
            .from('schools')
            .select(`
        id,
        name,
        slug,
        logo_url,
        email,
        phone,
        is_active,
        subscription_status,
        subscription_plan,
        school_settings (
          primary_color,
          secondary_color,
          accent_color,
          school_motto,
          parent_portal_enabled,
          student_portal_enabled
        )
      `)
            .eq('slug', slug.toLowerCase())
            .single()

        if (error || !school) {
            return NextResponse.json(
                { error: 'School not found', found: false },
                { status: 404 }
            )
        }

        // Check if school is active
        if (!school.is_active) {
            return NextResponse.json({
                found: true,
                active: false,
                error: 'This school has been deactivated'
            }, { status: 403 })
        }

        // Check subscription status
        if (school.subscription_status === 'suspended') {
            return NextResponse.json({
                found: true,
                active: false,
                error: 'School subscription is suspended'
            }, { status: 403 })
        }

        if (school.subscription_status === 'expired') {
            return NextResponse.json({
                found: true,
                active: false,
                error: 'School subscription has expired'
            }, { status: 403 })
        }

        return NextResponse.json({
            found: true,
            active: true,
            school: {
                id: school.id,
                name: school.name,
                slug: school.slug,
                logo_url: school.logo_url,
                email: school.email,
                phone: school.phone,
                plan: school.subscription_plan,
                settings: school.school_settings
            }
        })

    } catch (error) {
        console.error('Get school by slug error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
