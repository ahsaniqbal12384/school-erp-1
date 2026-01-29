import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create an untyped client for tables not in the generated types
function createAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

// GET - Get specific school SMS settings
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ schoolId: string }> }
) {
    try {
        const { schoolId } = await params
        const supabase = createAdminClient()
        
        // Fetch school
        const { data: school, error: schoolError } = await supabase
            .from('schools')
            .select('id, name, slug')
            .eq('id', schoolId)
            .single()

        if (schoolError || !school) {
            return NextResponse.json(
                { error: 'School not found' },
                { status: 404 }
            )
        }

        // Fetch SMS settings
        const { data: settings } = await supabase
            .from('school_sms_settings')
            .select('*')
            .eq('school_id', schoolId)
            .single()

        // Get usage for current month
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
        
        const { count: usageCount } = await supabase
            .from('sms_logs')
            .select('*', { count: 'exact', head: true })
            .eq('school_id', schoolId)
            .gte('created_at', startOfMonth)
            .in('status', ['sent', 'delivered'])

        // Get last SMS sent
        const { data: lastLog } = await supabase
            .from('sms_logs')
            .select('created_at')
            .eq('school_id', schoolId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        const schoolSMS = {
            id: settings?.id || school.id,
            school_id: school.id,
            school_name: school.name,
            school_slug: school.slug,
            is_sms_enabled: settings?.is_sms_enabled || false,
            monthly_limit: settings?.monthly_limit || 1000,
            used_this_month: usageCount || 0,
            can_send_attendance: settings?.can_send_attendance ?? true,
            can_send_fees: settings?.can_send_fees ?? true,
            can_send_exams: settings?.can_send_exams ?? true,
            can_send_general: settings?.can_send_general ?? true,
            can_send_emergency: settings?.can_send_emergency ?? true,
            last_sms_sent: lastLog?.created_at || null,
        }

        return NextResponse.json({ school: schoolSMS })
    } catch (error) {
        console.error('Error fetching school SMS settings:', error)
        return NextResponse.json(
            { error: 'Failed to fetch school SMS settings' },
            { status: 500 }
        )
    }
}

// PUT - Update specific school SMS settings
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ schoolId: string }> }
) {
    try {
        const { schoolId } = await params
        const supabase = createAdminClient()
        const body = await request.json()

        const {
            is_sms_enabled,
            monthly_limit,
            can_send_attendance,
            can_send_fees,
            can_send_exams,
            can_send_general,
            can_send_emergency,
        } = body

        // Check if settings exist for this school
        const { data: existingSettings } = await supabase
            .from('school_sms_settings')
            .select('id')
            .eq('school_id', schoolId)
            .single()

        const settingsData = {
            school_id: schoolId,
            is_sms_enabled,
            monthly_limit,
            can_send_attendance,
            can_send_fees,
            can_send_exams,
            can_send_general,
            can_send_emergency,
            updated_at: new Date().toISOString(),
        }

        let result
        if (existingSettings?.id) {
            // Update existing
            result = await supabase
                .from('school_sms_settings')
                .update(settingsData)
                .eq('id', existingSettings.id)
                .select()
                .single()
        } else {
            // Insert new
            result = await supabase
                .from('school_sms_settings')
                .insert({
                    ...settingsData,
                    created_at: new Date().toISOString(),
                })
                .select()
                .single()
        }

        if (result.error) {
            throw result.error
        }

        return NextResponse.json({ 
            success: true, 
            settings: result.data,
            message: 'School SMS settings updated successfully' 
        })
    } catch (error) {
        console.error('Error updating school SMS settings:', error)
        return NextResponse.json(
            { error: 'Failed to update school SMS settings' },
            { status: 500 }
        )
    }
}
