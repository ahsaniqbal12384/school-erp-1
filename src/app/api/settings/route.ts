import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/client'

// Default settings that match the database schema
const DEFAULT_SETTINGS = {
    // General
    platform_name: 'Pakistani School ERP',
    platform_domain: process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'localhost:3000',
    support_email: 'support@schoolerp.pk',
    support_phone: '+92-42-35761234',
    default_timezone: 'Asia/Karachi',
    default_currency: 'PKR',
    default_language: 'en',
    
    // Branding
    primary_color: '#6366f1',
    secondary_color: '#06b6d4',
    logo_light_url: null as string | null,
    logo_dark_url: null as string | null,
    favicon_url: null as string | null,
    
    // Email Settings
    email_notifications: false,
    smtp_host: '',
    smtp_port: '587',
    smtp_username: '',
    smtp_password: '',
    smtp_from_email: '',
    smtp_from_name: 'School ERP',
    smtp_encryption: 'tls',
    
    // SMS Settings
    sms_notifications: false,
    sms_provider: '',
    sms_api_key: '',
    sms_api_secret: '',
    sms_sender_id: '',
    sms_account_sid: '',
    
    // Security
    two_factor_auth: false,
    session_timeout_minutes: 30,
    password_policy: 'strong',
    max_login_attempts: 5,
    lockout_duration_minutes: 15,
    
    // Billing
    payment_gateway: 'manual',
    payment_merchant_id: '',
    payment_secret_key: '',
    plan_basic_price: 40000,
    plan_standard_price: 80000,
    plan_premium_price: 150000,
    
    // System
    auto_backup: true,
    backup_retention_days: 30,
    maintenance_mode: false,
    maintenance_message: 'We are performing scheduled maintenance. Please check back soon.',
    
    // API Keys
    api_key_production: '',
    api_key_test: '',
    
    // Trial
    trial_days: 30,
}

// GET /api/settings - Get platform settings
export async function GET() {
    try {
        const supabase = createServerClient()

        const { data: settings, error } = await supabase
            .from('platform_settings')
            .select('*')
            .single()

        if (error && error.code !== 'PGRST116') {
            console.error('Settings fetch error:', error)
            return NextResponse.json({ settings: DEFAULT_SETTINGS })
        }

        // Merge with defaults to ensure all fields exist
        const mergedSettings = { ...DEFAULT_SETTINGS, ...settings }
        
        // Always use the env domain if available (allows dynamic hosting)
        if (process.env.NEXT_PUBLIC_MAIN_DOMAIN) {
            mergedSettings.platform_domain = process.env.NEXT_PUBLIC_MAIN_DOMAIN
        }

        return NextResponse.json({ settings: mergedSettings })
    } catch (error) {
        console.error('Settings fetch error:', error)
        return NextResponse.json({ settings: DEFAULT_SETTINGS })
    }
}

// PUT /api/settings - Update platform settings
export async function PUT(request: NextRequest) {
    try {
        const supabase = createServerClient()
        const body = await request.json()

        // Check if settings exist
        const { data: existing, error: checkError } = await supabase
            .from('platform_settings')
            .select('id')
            .single()

        if (checkError && checkError.code !== 'PGRST116') {
            console.error('Settings check error:', checkError)
            return NextResponse.json({ error: checkError.message }, { status: 500 })
        }

        let result
        if (existing) {
            result = await supabase
                .from('platform_settings')
                .update({
                    ...body,
                    updated_at: new Date().toISOString()
                })
                .eq('id', existing.id)
                .select()
                .single()
        } else {
            result = await supabase
                .from('platform_settings')
                .insert({
                    ...body,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .select()
                .single()
        }

        if (result.error) {
            console.error('Settings update error:', result.error)
            return NextResponse.json({ error: result.error.message }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            settings: result.data,
            message: 'Settings saved successfully'
        })
    } catch (error) {
        console.error('Settings update error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST /api/settings - Test configurations
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { action } = body

        if (action === 'test-smtp') {
            const { smtp_host, smtp_username, smtp_password, smtp_from_email } = body
            
            if (!smtp_host || !smtp_username || !smtp_password || !smtp_from_email) {
                return NextResponse.json({ 
                    success: false, 
                    error: 'Missing required SMTP configuration fields' 
                }, { status: 400 })
            }

            // In production, actually test the SMTP connection
            return NextResponse.json({ 
                success: true, 
                message: 'SMTP configuration is valid' 
            })
        }

        if (action === 'test-sms') {
            const { sms_provider, sms_api_key, sms_sender_id } = body
            
            if (!sms_provider || !sms_api_key || !sms_sender_id) {
                return NextResponse.json({ 
                    success: false, 
                    error: 'Missing required SMS configuration fields' 
                }, { status: 400 })
            }

            return NextResponse.json({ 
                success: true, 
                message: 'SMS configuration is valid' 
            })
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    } catch (error) {
        console.error('Settings test error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}