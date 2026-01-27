// School Portal Settings API
// GET: Fetch portal settings by school slug (public)
// POST: Create settings
// PATCH: Update settings (admin only)

import { createClient } from '@/lib/supabase/server'
import { createServerClient } from '@/lib/supabase/client'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch portal settings (public)
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)
        const schoolId = searchParams.get('school_id')
        const schoolSlug = searchParams.get('slug')

        if (!schoolId && !schoolSlug) {
            return NextResponse.json({ error: 'School ID or slug required' }, { status: 400 })
        }

        // First get the school
        let schoolQuery = (supabase.from('schools') as any).select('id, name, slug, logo_url, phone, email, address, city')
        
        if (schoolId) {
            schoolQuery = schoolQuery.eq('id', schoolId)
        } else if (schoolSlug) {
            schoolQuery = schoolQuery.eq('slug', schoolSlug)
        }

        const { data: school, error: schoolError } = await schoolQuery.single()

        if (schoolError || !school) {
            return NextResponse.json({ error: 'School not found' }, { status: 404 })
        }

        // Get portal settings
        const { data: settings } = await (supabase
            .from('school_portal_settings') as any)
            .select('*')
            .eq('school_id', school.id)
            .single()

        // Get facilities
        const { data: facilities } = await (supabase
            .from('school_facilities') as any)
            .select('*')
            .eq('school_id', school.id)
            .eq('is_active', true)
            .order('display_order', { ascending: true })

        // Get gallery
        const { data: gallery } = await (supabase
            .from('school_gallery') as any)
            .select('*')
            .eq('school_id', school.id)
            .eq('is_active', true)
            .order('display_order', { ascending: true })
            .limit(12)

        return NextResponse.json({
            school,
            settings: settings || {
                hero_title: `Welcome to ${school.name}`,
                hero_subtitle: 'Empowering minds, shaping futures',
                primary_color: '#3b82f6',
                secondary_color: '#06b6d4',
                show_about_section: true,
                show_facilities_section: true,
                show_contact_section: true,
                show_student_login: true,
                show_parent_login: true,
                show_teacher_login: true,
                show_admin_login: true,
            },
            facilities: facilities || [],
            gallery: gallery || []
        })
    } catch (error: unknown) {
        console.error('Portal settings GET error:', error)
        const message = error instanceof Error ? error.message : 'Failed to fetch settings'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// POST - Create portal settings
export async function POST(request: NextRequest) {
    try {
        const supabase = createServerClient()
        const body = await request.json()

        const { school_id, ...settings } = body

        if (!school_id) {
            return NextResponse.json({ error: 'School ID required' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('school_portal_settings')
            .insert({ school_id, ...settings })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ data }, { status: 201 })
    } catch (error: unknown) {
        console.error('Portal settings POST error:', error)
        const message = error instanceof Error ? error.message : 'Failed to create settings'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// PATCH - Update portal settings
export async function PATCH(request: NextRequest) {
    try {
        const supabase = createServerClient()
        const body = await request.json()

        const { school_id, ...settings } = body

        if (!school_id) {
            return NextResponse.json({ error: 'School ID required' }, { status: 400 })
        }

        // Check if settings exist
        const { data: existing } = await supabase
            .from('school_portal_settings')
            .select('id')
            .eq('school_id', school_id)
            .single()

        let data, error

        if (existing) {
            // Update existing
            const result = await supabase
                .from('school_portal_settings')
                .update({ ...settings, updated_at: new Date().toISOString() })
                .eq('school_id', school_id)
                .select()
                .single()
            data = result.data
            error = result.error
        } else {
            // Create new
            const result = await supabase
                .from('school_portal_settings')
                .insert({ school_id, ...settings })
                .select()
                .single()
            data = result.data
            error = result.error
        }

        if (error) throw error

        return NextResponse.json({ data, message: 'Settings updated successfully' })
    } catch (error: unknown) {
        console.error('Portal settings PATCH error:', error)
        const message = error instanceof Error ? error.message : 'Failed to update settings'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
