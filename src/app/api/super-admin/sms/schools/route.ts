import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create an untyped client for tables not in the generated types
function createAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

// GET - Fetch all schools with SMS settings
export async function GET(request: NextRequest) {
    try {
        const supabase = createAdminClient()
        
        // Fetch all schools
        const { data: schools, error: schoolsError } = await supabase
            .from('schools')
            .select('id, name, slug')
            .order('name')

        if (schoolsError) {
            throw schoolsError
        }

        // Fetch SMS settings for all schools
        const { data: smsSettings, error: smsError } = await supabase
            .from('school_sms_settings')
            .select('*')

        // Get SMS usage for current month
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
        
        const { data: usageLogs } = await supabase
            .from('sms_logs')
            .select('school_id, created_at')
            .gte('created_at', startOfMonth)
            .in('status', ['sent', 'delivered'])

        // Get last SMS sent for each school
        const { data: lastSentLogs } = await supabase
            .from('sms_logs')
            .select('school_id, created_at')
            .order('created_at', { ascending: false })

        // Create a map of school_id to last sent date
        const lastSentMap: Record<string, string> = {}
        lastSentLogs?.forEach(log => {
            if (!lastSentMap[log.school_id]) {
                lastSentMap[log.school_id] = log.created_at
            }
        })

        // Create a map of school_id to usage count
        const usageMap: Record<string, number> = {}
        usageLogs?.forEach(log => {
            usageMap[log.school_id] = (usageMap[log.school_id] || 0) + 1
        })

        // Create a map of school_id to SMS settings
        const settingsMap: Record<string, Record<string, unknown>> = {}
        smsSettings?.forEach((setting: Record<string, unknown>) => {
            settingsMap[setting.school_id as string] = setting
        })

        // Combine data
        const schoolsWithSMS = schools?.map(school => {
            const settings = settingsMap[school.id]
            return {
                id: settings?.id || school.id,
                school_id: school.id,
                school_name: school.name,
                school_slug: school.slug,
                is_sms_enabled: settings?.is_sms_enabled || false,
                monthly_limit: settings?.monthly_limit || 1000,
                used_this_month: usageMap[school.id] || 0,
                can_send_attendance: settings?.can_send_attendance ?? true,
                can_send_fees: settings?.can_send_fees ?? true,
                can_send_exams: settings?.can_send_exams ?? true,
                can_send_general: settings?.can_send_general ?? true,
                can_send_emergency: settings?.can_send_emergency ?? true,
                last_sms_sent: lastSentMap[school.id] || null,
            }
        }) || []

        return NextResponse.json({ schools: schoolsWithSMS })
    } catch (error) {
        console.error('Error fetching schools SMS settings:', error)
        return NextResponse.json(
            { error: 'Failed to fetch schools SMS settings' },
            { status: 500 }
        )
    }
}

// POST - Create/Update SMS settings for a school
export async function POST(request: NextRequest) {
    try {
        const supabase = createAdminClient()
        const body = await request.json()

        const {
            school_id,
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
            .eq('school_id', school_id)
            .single()

        const settingsData = {
            school_id,
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
            message: 'School SMS settings saved successfully' 
        })
    } catch (error) {
        console.error('Error saving school SMS settings:', error)
        return NextResponse.json(
            { error: 'Failed to save school SMS settings' },
            { status: 500 }
        )
    }
}
