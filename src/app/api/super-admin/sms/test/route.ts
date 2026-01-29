import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create an untyped client for tables not in the generated types
function createAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

// POST - Send test SMS
export async function POST(request: NextRequest) {
    try {
        const supabase = createAdminClient()
        const body = await request.json()

        const { phone } = body

        if (!phone) {
            return NextResponse.json(
                { error: 'Phone number is required' },
                { status: 400 }
            )
        }

        // Get platform SMS config
        const { data: config } = await supabase
            .from('platform_sms_config')
            .select('*')
            .single()

        if (!config || !config.is_enabled) {
            return NextResponse.json(
                { error: 'SMS service is not configured or enabled' },
                { status: 400 }
            )
        }

        // Format phone number
        let formattedPhone = phone.replace(/\D/g, '')
        if (formattedPhone.startsWith('0')) {
            formattedPhone = '92' + formattedPhone.substring(1)
        } else if (!formattedPhone.startsWith('92') && formattedPhone.length === 10) {
            formattedPhone = '92' + formattedPhone
        }
        formattedPhone = '+' + formattedPhone

        const testMessage = 'This is a test message from School ERP. If you received this, your SMS configuration is working correctly.'

        // Send based on provider
        let result: { success: boolean; messageId?: string; error?: string }

        switch (config.provider) {
            case 'twilio':
                result = await sendViaTwilio(config, formattedPhone, testMessage)
                break
            case 'zong':
            case 'jazz':
            case 'telenor':
                result = await sendViaPakistaniGateway(config, formattedPhone, testMessage)
                break
            case 'custom':
                result = await sendViaCustomAPI(config, formattedPhone, testMessage)
                break
            default:
                // Mock send for development/testing
                result = {
                    success: true,
                    messageId: `mock_${Date.now()}`,
                }
                console.log(`[SMS Test] To: ${formattedPhone}, Message: ${testMessage}`)
        }

        // Log the test SMS
        await supabase.from('sms_logs').insert({
            school_id: null, // System-level test
            recipient_phone: formattedPhone,
            message: testMessage,
            status: result.success ? 'sent' : 'failed',
            message_id: result.messageId,
            error_message: result.error,
            sms_type: 'test',
            created_at: new Date().toISOString(),
        })

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || 'Failed to send test SMS' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: `Test SMS sent successfully to ${formattedPhone}`,
            messageId: result.messageId,
        })
    } catch (error) {
        console.error('Error sending test SMS:', error)
        return NextResponse.json(
            { error: 'Failed to send test SMS' },
            { status: 500 }
        )
    }
}

// Twilio implementation
async function sendViaTwilio(
    config: Record<string, unknown>,
    phone: string,
    message: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
        const accountSid = config.api_key as string
        const authToken = config.api_secret as string
        const from = config.sender_id as string

        const response = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
                },
                body: new URLSearchParams({
                    To: phone,
                    From: from || '',
                    Body: message,
                }),
            }
        )

        const data = await response.json()

        return {
            success: response.ok,
            messageId: data.sid,
            error: data.message,
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}

// Pakistani gateway implementation
async function sendViaPakistaniGateway(
    config: Record<string, unknown>,
    phone: string,
    message: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
        const response = await fetch(config.base_url as string, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: config.username,
                password: config.password,
                sender: config.sender_id,
                mobile: phone,
                message: message,
            }),
        })

        const data = await response.json()

        return {
            success: data.status === 'success' || data.code === 0,
            messageId: data.messageId || data.id,
            error: data.error || data.message,
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}

// Custom API implementation
async function sendViaCustomAPI(
    config: Record<string, unknown>,
    phone: string,
    message: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
        const response = await fetch(config.base_url as string, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.api_key}`,
            },
            body: JSON.stringify({
                to: phone,
                message: message,
                sender_id: config.sender_id,
            }),
        })

        const data = await response.json()

        return {
            success: response.ok,
            messageId: data.id,
            error: data.error,
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}
