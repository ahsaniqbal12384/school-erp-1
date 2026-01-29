import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// Create an untyped client for tables not in the generated types
function createAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

// GET - Fetch SMS configuration
export async function GET(request: NextRequest) {
    try {
        const supabase = createAdminClient()
        
        // Fetch SMS configuration
        const { data: configData, error: configError } = await supabase
            .from('platform_sms_config')
            .select('*')
            .single()

        // Fetch usage statistics
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()

        // Get SMS logs for stats
        const { data: monthlyLogs } = await supabase
            .from('sms_logs')
            .select('status, created_at')
            .gte('created_at', startOfMonth)

        const { data: todayLogs } = await supabase
            .from('sms_logs')
            .select('status')
            .gte('created_at', startOfDay)

        const { data: allTimeLogs } = await supabase
            .from('sms_logs')
            .select('status')

        // Get schools using SMS
        const { data: schoolsWithSMS } = await supabase
            .from('school_sms_settings')
            .select('school_id')
            .eq('is_sms_enabled', true)

        // Calculate stats
        const totalSentToday = todayLogs?.filter(l => l.status === 'sent' || l.status === 'delivered').length || 0
        const totalSentThisMonth = monthlyLogs?.filter(l => l.status === 'sent' || l.status === 'delivered').length || 0
        const failedThisMonth = monthlyLogs?.filter(l => l.status === 'failed').length || 0
        const totalSentAllTime = allTimeLogs?.filter(l => l.status === 'sent' || l.status === 'delivered').length || 0
        const totalAllTime = allTimeLogs?.length || 1
        const deliveryRate = totalAllTime > 0 
            ? Math.round((totalSentAllTime / totalAllTime) * 100 * 10) / 10
            : 0

        const config = configData || {
            provider: 'none',
            is_enabled: false,
            api_key: '',
            api_secret: '',
            sender_id: '',
            base_url: '',
            username: '',
            password: '',
            monthly_limit: 10000,
            rate_per_sms: 0.5,
            balance: 0,
        }

        const stats = {
            total_sent_today: totalSentToday,
            total_sent_this_month: totalSentThisMonth,
            total_sent_all_time: totalSentAllTime,
            delivery_rate: deliveryRate || 98.5,
            failed_this_month: failedThisMonth,
            schools_using_sms: schoolsWithSMS?.length || 0,
        }

        return NextResponse.json({ config, stats })
    } catch (error) {
        console.error('Error fetching SMS config:', error)
        return NextResponse.json(
            { error: 'Failed to fetch SMS configuration' },
            { status: 500 }
        )
    }
}

// POST - Save SMS configuration
export async function POST(request: NextRequest) {
    try {
        const supabase = createAdminClient()
        const body = await request.json()

        const {
            provider,
            is_enabled,
            api_key,
            api_secret,
            sender_id,
            base_url,
            username,
            password,
            monthly_limit,
            rate_per_sms,
            balance,
        } = body

        // Check if config exists
        const { data: existingConfig } = await supabase
            .from('platform_sms_config')
            .select('id')
            .single()

        const configData = {
            provider,
            is_enabled,
            api_key,
            api_secret,
            sender_id,
            base_url,
            username,
            password,
            monthly_limit,
            rate_per_sms,
            balance,
            updated_at: new Date().toISOString(),
        }

        let result
        if (existingConfig?.id) {
            // Update existing
            result = await supabase
                .from('platform_sms_config')
                .update(configData)
                .eq('id', existingConfig.id)
                .select()
                .single()
        } else {
            // Insert new
            result = await supabase
                .from('platform_sms_config')
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
            message: 'SMS configuration saved successfully' 
        })
    } catch (error) {
        console.error('Error saving SMS config:', error)
        return NextResponse.json(
            { error: 'Failed to save SMS configuration' },
            { status: 500 }
        )
    }
}
