import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

// Create an untyped client for tables not in the generated types
function createAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

// POST - Send test email
export async function POST(request: NextRequest) {
    try {
        const supabase = createAdminClient()
        const body = await request.json()

        const { email } = body

        if (!email) {
            return NextResponse.json(
                { error: 'Email address is required' },
                { status: 400 }
            )
        }

        // Get platform email config
        const { data: config } = await supabase
            .from('platform_email_config')
            .select('*')
            .single()

        if (!config || !config.is_enabled) {
            return NextResponse.json(
                { error: 'Email service is not configured or enabled' },
                { status: 400 }
            )
        }

        const testSubject = 'Test Email from School ERP'
        const testMessage = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #6366f1;">Test Email from School ERP</h2>
                <p>This is a test email to verify your email configuration is working correctly.</p>
                <p>If you received this email, your email service is properly configured.</p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                <p style="color: #6b7280; font-size: 12px;">
                    Sent from School ERP Platform<br />
                    Provider: ${config.provider}<br />
                    Sent at: ${new Date().toISOString()}
                </p>
            </div>
        `

        // Send based on provider
        let result: { success: boolean; messageId?: string; error?: string }

        switch (config.provider) {
            case 'smtp':
                result = await sendViaSMTP(config, email, testSubject, testMessage)
                break
            case 'sendgrid':
                result = await sendViaSendGrid(config, email, testSubject, testMessage)
                break
            case 'mailgun':
                result = await sendViaMailgun(config, email, testSubject, testMessage)
                break
            case 'resend':
                result = await sendViaResend(config, email, testSubject, testMessage)
                break
            default:
                // Mock send for development/testing
                result = {
                    success: true,
                    messageId: `mock_${Date.now()}`,
                }
                console.log(`[Email Test] To: ${email}, Subject: ${testSubject}`)
        }

        // Log the test email
        await supabase.from('email_logs').insert({
            school_id: null, // System-level test
            recipient_email: email,
            subject: testSubject,
            body: testMessage,
            status: result.success ? 'sent' : 'failed',
            message_id: result.messageId,
            error_message: result.error,
            email_type: 'test',
            created_at: new Date().toISOString(),
        })

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || 'Failed to send test email' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: `Test email sent successfully to ${email}`,
            messageId: result.messageId,
        })
    } catch (error) {
        console.error('Error sending test email:', error)
        return NextResponse.json(
            { error: 'Failed to send test email' },
            { status: 500 }
        )
    }
}

// SMTP implementation
async function sendViaSMTP(
    config: Record<string, unknown>,
    to: string,
    subject: string,
    html: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
        const transporter = nodemailer.createTransport({
            host: config.smtp_host as string,
            port: config.smtp_port as number,
            secure: config.smtp_encryption === 'ssl',
            auth: {
                user: config.smtp_username as string,
                pass: config.smtp_password as string,
            },
            tls: config.smtp_encryption === 'tls' ? { rejectUnauthorized: false } : undefined,
        })

        const info = await transporter.sendMail({
            from: `"${config.from_name}" <${config.from_email}>`,
            to,
            subject,
            html,
            replyTo: config.reply_to as string || undefined,
        })

        return {
            success: true,
            messageId: info.messageId,
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}

// SendGrid implementation
async function sendViaSendGrid(
    config: Record<string, unknown>,
    to: string,
    subject: string,
    html: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.api_key}`,
            },
            body: JSON.stringify({
                personalizations: [{ to: [{ email: to }] }],
                from: { email: config.from_email, name: config.from_name },
                reply_to: config.reply_to ? { email: config.reply_to } : undefined,
                subject,
                content: [{ type: 'text/html', value: html }],
            }),
        })

        if (!response.ok) {
            const data = await response.json()
            return {
                success: false,
                error: data.errors?.[0]?.message || 'Failed to send via SendGrid',
            }
        }

        return {
            success: true,
            messageId: response.headers.get('x-message-id') || `sg_${Date.now()}`,
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}

// Mailgun implementation
async function sendViaMailgun(
    config: Record<string, unknown>,
    to: string,
    subject: string,
    html: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
        const domain = config.api_secret as string // Domain is stored in api_secret
        const apiKey = config.api_key as string

        const formData = new FormData()
        formData.append('from', `${config.from_name} <${config.from_email}>`)
        formData.append('to', to)
        formData.append('subject', subject)
        formData.append('html', html)
        if (config.reply_to) {
            formData.append('h:Reply-To', config.reply_to as string)
        }

        const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`api:${apiKey}`).toString('base64'),
            },
            body: formData,
        })

        const data = await response.json()

        return {
            success: response.ok,
            messageId: data.id,
            error: data.message,
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}

// Resend implementation
async function sendViaResend(
    config: Record<string, unknown>,
    to: string,
    subject: string,
    html: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.api_key}`,
            },
            body: JSON.stringify({
                from: `${config.from_name} <${config.from_email}>`,
                to: [to],
                subject,
                html,
                reply_to: config.reply_to || undefined,
            }),
        })

        const data = await response.json()

        return {
            success: response.ok,
            messageId: data.id,
            error: data.message,
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}
