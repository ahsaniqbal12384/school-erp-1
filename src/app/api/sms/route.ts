import { NextRequest, NextResponse } from 'next/server'
import { createUntypedClient } from '@/lib/supabase/server'
import { smsService } from '@/lib/sms'
import type { SMSConfig, SMSBroadcast, SMSLog } from '@/types/database.types'

// Type definitions
interface Recipient {
    phone: string
    name: string
    type: string
    student_id?: string
}

interface SendResult {
    phone: string
    name: string
    success: boolean
    error?: string
}

export async function POST(request: NextRequest) {
    const supabase = await createUntypedClient()
    
    try {
        const body = await request.json()
        const { 
            school_id, 
            recipients, 
            message, 
            target_type,
            target_filters,
            scheduled_at,
            sent_by 
        } = body

        if (!school_id || !message) {
            return NextResponse.json({ 
                error: 'Missing required fields: school_id, message' 
            }, { status: 400 })
        }

        if (!recipients || recipients.length === 0) {
            return NextResponse.json({ 
                error: 'At least one recipient is required' 
            }, { status: 400 })
        }

        // Get school's SMS configuration
        const { data: smsConfigData } = await supabase
            .from('sms_config')
            .select('*')
            .eq('school_id', school_id)
            .single()

        const smsConfig = smsConfigData as SMSConfig | null

        // Check SMS credits
        if (smsConfig && smsConfig.credits_balance < recipients.length) {
            return NextResponse.json({ 
                error: `Insufficient SMS credits. Required: ${recipients.length}, Available: ${smsConfig.credits_balance}` 
            }, { status: 400 })
        }

        // Configure SMS service if config exists
        if (smsConfig && smsConfig.is_active) {
            smsService.configure({
                provider: smsConfig.provider as 'twilio' | 'zong' | 'jazz' | 'telenor' | 'custom',
                apiKey: smsConfig.api_key,
                apiSecret: smsConfig.api_secret,
                senderId: smsConfig.sender_id,
                baseUrl: smsConfig.base_url,
                username: smsConfig.username,
                password: smsConfig.password,
            })
        }

        // Create broadcast record
        const broadcastInsert: Partial<SMSBroadcast> = {
            school_id,
            title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
            message,
            target_type: target_type || 'custom',
            target_filters: target_filters || {},
            total_recipients: recipients.length,
            scheduled_at: scheduled_at || undefined,
            sent_by,
            status: scheduled_at ? 'scheduled' : 'sending'
        }

        const { data: broadcastData, error: broadcastError } = await supabase
            .from('sms_broadcasts')
            .insert(broadcastInsert)
            .select()
            .single()

        const broadcast = broadcastData as SMSBroadcast | null

        if (broadcastError || !broadcast) {
            console.error('Error creating broadcast:', broadcastError)
            return NextResponse.json({ error: broadcastError?.message || 'Failed to create broadcast' }, { status: 500 })
        }

        // If scheduled, just return the broadcast record
        if (scheduled_at) {
            return NextResponse.json({
                success: true,
                message: 'SMS scheduled successfully',
                broadcast
            })
        }

        // Send SMS to all recipients
        let sentCount = 0
        let deliveredCount = 0
        let failedCount = 0
        const results: SendResult[] = []

        const typedRecipients = recipients as Recipient[]

        for (const recipient of typedRecipients) {
            try {
                const result = await smsService.send({
                    to: recipient.phone,
                    message
                })

                // Log each SMS
                const smsLogInsert: Partial<SMSLog> = {
                    school_id,
                    message,
                    recipient_phone: recipient.phone,
                    recipient_name: recipient.name,
                    recipient_type: recipient.type,
                    student_id: recipient.student_id || undefined,
                    status: result.success ? 'sent' : 'failed',
                    message_id: result.messageId,
                    error_message: result.error,
                    sent_by,
                    sent_at: new Date().toISOString()
                }

                await supabase
                    .from('sms_logs')
                    .insert(smsLogInsert)

                if (result.success) {
                    sentCount++
                    deliveredCount++
                    results.push({ phone: recipient.phone, name: recipient.name, success: true })
                } else {
                    failedCount++
                    results.push({ phone: recipient.phone, name: recipient.name, success: false, error: result.error })
                }
            } catch (error) {
                failedCount++
                results.push({ 
                    phone: recipient.phone, 
                    name: recipient.name, 
                    success: false, 
                    error: error instanceof Error ? error.message : 'Unknown error' 
                })
            }
        }

        // Update broadcast record
        await supabase
            .from('sms_broadcasts')
            .update({
                sent_count: sentCount,
                delivered_count: deliveredCount,
                failed_count: failedCount,
                status: 'sent',
                sent_at: new Date().toISOString(),
                completed_at: new Date().toISOString()
            })
            .eq('id', broadcast.id)

        // Deduct credits
        if (smsConfig) {
            await supabase
                .from('sms_config')
                .update({ credits_balance: smsConfig.credits_balance - sentCount })
                .eq('id', smsConfig.id)
        }

        return NextResponse.json({
            success: true,
            message: `SMS sent to ${sentCount} of ${recipients.length} recipients`,
            summary: {
                total: recipients.length,
                sent: sentCount,
                delivered: deliveredCount,
                failed: failedCount
            },
            results,
            broadcast_id: broadcast.id
        })
    } catch (error) {
        console.error('SMS send error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    const supabase = await createUntypedClient()
    const { searchParams } = new URL(request.url)
    
    const schoolId = searchParams.get('school_id')
    const type = searchParams.get('type') || 'logs' // 'logs', 'broadcasts', 'templates', 'config'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!schoolId) {
        return NextResponse.json({ error: 'School ID is required' }, { status: 400 })
    }

    try {
        let data = null
        let error = null

        switch (type) {
            case 'broadcasts':
                const broadcastsResult = await supabase
                    .from('sms_broadcasts')
                    .select('*')
                    .eq('school_id', schoolId)
                    .order('created_at', { ascending: false })
                    .range(offset, offset + limit - 1)
                data = broadcastsResult.data
                error = broadcastsResult.error
                break

            case 'templates':
                const templatesResult = await supabase
                    .from('sms_templates')
                    .select('*')
                    .eq('school_id', schoolId)
                    .eq('is_active', true)
                    .order('category', { ascending: true })
                data = templatesResult.data
                error = templatesResult.error
                break

            case 'config':
                const configResult = await supabase
                    .from('sms_config')
                    .select('provider, sender_id, is_active, credits_balance')
                    .eq('school_id', schoolId)
                    .single()
                data = configResult.data
                error = configResult.error
                break

            default: // logs
                const logsResult = await supabase
                    .from('sms_logs')
                    .select('*')
                    .eq('school_id', schoolId)
                    .order('sent_at', { ascending: false })
                    .range(offset, offset + limit - 1)
                data = logsResult.data
                error = logsResult.error
        }

        if (error) {
            console.error('SMS GET error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('SMS GET error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
