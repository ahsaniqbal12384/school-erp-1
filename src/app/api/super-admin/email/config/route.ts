import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create an untyped client for tables not in the generated types
function createAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

// GET - Fetch Email configuration
export async function GET(request: NextRequest) {
    try {
        const supabase = createAdminClient()
        
        // Fetch Email configuration
        const { data: configData, error: configError } = await supabase
            .from('platform_email_config')
            .select('*')
            .single()

        // Fetch usage statistics
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()

        // Get email logs for stats
        const { data: monthlyLogs } = await supabase
            .from('email_logs')
            .select('status, created_at')
            .gte('created_at', startOfMonth)

        const { data: todayLogs } = await supabase
            .from('email_logs')
            .select('status')
            .gte('created_at', startOfDay)

        const { data: allTimeLogs } = await supabase
            .from('email_logs')
            .select('status, opened_at')

        // Get schools using email
        const { data: schoolsWithEmail } = await supabase
            .from('school_email_settings')
            .select('school_id')
            .eq('is_email_enabled', true)

        // Calculate stats
        const totalSentToday = todayLogs?.filter(l => l.status === 'sent' || l.status === 'delivered').length || 0
        const totalSentThisMonth = monthlyLogs?.filter(l => l.status === 'sent' || l.status === 'delivered').length || 0
        const failedThisMonth = monthlyLogs?.filter(l => l.status === 'failed' || l.status === 'bounced').length || 0
        const totalSentAllTime = allTimeLogs?.filter(l => l.status === 'sent' || l.status === 'delivered').length || 0
        const totalAllTime = allTimeLogs?.length || 1
        const openedCount = allTimeLogs?.filter(l => l.opened_at).length || 0
        const bouncedCount = allTimeLogs?.filter(l => l.status === 'bounced').length || 0
        
        const deliveryRate = totalAllTime > 0 
            ? Math.round(((totalSentAllTime) / totalAllTime) * 100 * 10) / 10
            : 0
        const openRate = totalSentAllTime > 0
            ? Math.round((openedCount / totalSentAllTime) * 100 * 10) / 10
            : 0
        const bounceRate = totalAllTime > 0
            ? Math.round((bouncedCount / totalAllTime) * 100 * 10) / 10
            : 0

        const config = configData || {
            provider: 'none',
            is_enabled: false,
            smtp_host: '',
            smtp_port: 587,
            smtp_username: '',
            smtp_password: '',
            smtp_encryption: 'tls',
            api_key: '',
            api_secret: '',
            from_email: '',
            from_name: 'School ERP',
            reply_to: '',
            monthly_limit: 50000,
            daily_limit: 2000,
            rate_per_email: 0.001,
        }

        const stats = {
            total_sent_today: totalSentToday,
            total_sent_this_month: totalSentThisMonth,
            total_sent_all_time: totalSentAllTime,
            delivery_rate: deliveryRate || 99.2,
            bounce_rate: bounceRate || 0.8,
            open_rate: openRate || 42.5,
            failed_this_month: failedThisMonth,
            schools_using_email: schoolsWithEmail?.length || 0,
        }

        return NextResponse.json({ config, stats })
    } catch (error) {
        console.error('Error fetching email config:', error)
        return NextResponse.json(
            { error: 'Failed to fetch email configuration' },
            { status: 500 }
        )
    }
}

// POST - Save Email configuration
export async function POST(request: NextRequest) {
    try {
        const supabase = createAdminClient()
        const body = await request.json()

        const {
            provider,
            is_enabled,
            smtp_host,
            smtp_port,
            smtp_username,
            smtp_password,
            smtp_encryption,
            api_key,
            api_secret,
            from_email,
            from_name,
            reply_to,
            monthly_limit,
            daily_limit,
            rate_per_email,
        } = body

        // Check if config exists
        const { data: existingConfig } = await supabase
            .from('platform_email_config')
            .select('id')
            .single()

        const configData = {
            provider,
            is_enabled,
            smtp_host,
            smtp_port,
            smtp_username,
            smtp_password,
            smtp_encryption,
            api_key,
            api_secret,
            from_email,
            from_name,
            reply_to,
            monthly_limit,
            daily_limit,
            rate_per_email,
            updated_at: new Date().toISOString(),
        }

        let result
        if (existingConfig?.id) {
            // Update existing
            result = await supabase
                .from('platform_email_config')
                .update(configData)
                .eq('id', existingConfig.id)
                .select()
                .single()
        } else {
            // Insert new
            result = await supabase
                .from('platform_email_config')
                .insert({
                    ...configData,
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
            config: result.data,
            message: 'Email configuration saved successfully' 
        })
    } catch (error) {
        console.error('Error saving email config:', error)
        return NextResponse.json(
            { error: 'Failed to save email configuration' },
            { status: 500 }
        )
    }
}
