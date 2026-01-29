import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create an untyped client for tables not in the generated types
function createAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

// GET - Fetch all schools with email settings
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

        // Fetch email settings for all schools
        const { data: emailSettings, error: emailError } = await supabase
            .from('school_email_settings')
            .select('*')

        // Get email usage for current month
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
        
        const { data: usageLogs } = await supabase
            .from('email_logs')
            .select('school_id, created_at')
            .gte('created_at', startOfMonth)
            .in('status', ['sent', 'delivered'])

        // Get last email sent for each school
        const { data: lastSentLogs } = await supabase
            .from('email_logs')
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

        // Create a map of school_id to email settings
        const settingsMap: Record<string, Record<string, unknown>> = {}
        emailSettings?.forEach((setting: Record<string, unknown>) => {
            settingsMap[setting.school_id as string] = setting
        })

        // Combine data
        const schoolsWithEmail = schools?.map(school => {
            const settings = settingsMap[school.id]
            return {
                id: settings?.id || school.id,
                school_id: school.id,
                school_name: school.name,
                school_slug: school.slug,
                is_email_enabled: settings?.is_email_enabled || false,
                monthly_limit: settings?.monthly_limit || 5000,
                used_this_month: usageMap[school.id] || 0,
                can_send_attendance: settings?.can_send_attendance ?? true,
                can_send_fees: settings?.can_send_fees ?? true,
                can_send_exams: settings?.can_send_exams ?? true,
                can_send_general: settings?.can_send_general ?? true,
                can_send_newsletters: settings?.can_send_newsletters ?? true,
                last_email_sent: lastSentMap[school.id] || null,
            }
        }) || []

        return NextResponse.json({ schools: schoolsWithEmail })
    } catch (error) {
        console.error('Error fetching schools email settings:', error)
        return NextResponse.json(
            { error: 'Failed to fetch schools email settings' },
            { status: 500 }
        )
    }
}

// POST - Create/Update email settings for a school
export async function POST(request: NextRequest) {
    try {
        const supabase = createAdminClient()
        const body = await request.json()

        const {
            school_id,
            is_email_enabled,
            monthly_limit,
            can_send_attendance,
            can_send_fees,
            can_send_exams,
            can_send_general,
            can_send_newsletters,
        } = body

        // Check if settings exist for this school
        const { data: existingSettings } = await supabase
            .from('school_email_settings')
            .select('id')
            .eq('school_id', school_id)
            .single()

        const settingsData = {
            school_id,
            is_email_enabled,
            monthly_limit,
            can_send_attendance,
            can_send_fees,
            can_send_exams,
            can_send_general,
            can_send_newsletters,
            updated_at: new Date().toISOString(),
        }

        let result
        if (existingSettings?.id) {
            // Update existing
            result = await supabase
                .from('school_email_settings')
                .update(settingsData)
                .eq('id', existingSettings.id)
                .select()
                .single()
        } else {
            // Insert new
            result = await supabase
                .from('school_email_settings')
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
            message: 'School email settings saved successfully' 
        })
    } catch (error) {
        console.error('Error saving school email settings:', error)
        return NextResponse.json(
            { error: 'Failed to save school email settings' },
            { status: 500 }
        )
    }
}
